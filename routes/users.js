var express = require('express')
var router = express.Router()
const querySql = require('../db/index')
const { PWD_SALT, PRIVARE_KEY, EXPIRESD } = require('../utils/constant')
const { md5, upload } = require('../utils/index')
const jwt = require('jsonwebtoken')

// var upload = multer({ dest: 'upload/' })

/* 注册接口*/
router.post('/register', async function (req, res, next) {
	//   res.send('respond with a resource');
	let { username, password, nickname } = req.body

	try {
		let user = await querySql('select * from user where username = ?', [
			username,
		])
		if (!user || user.length === 0) {
			password = md5(`${password}${PWD_SALT}`)
			console.log(password)
			await querySql(
				'insert into user(username,password,nickname) value(?,?,?)',
				[username, password, nickname]
			)
			res.send({ code: 0, meg: '注册成功' })
		} else {
			res.send({ code: -1, msg: '该账号已经注册' })
		}
	} catch (e) {
		console.log(e)
		next(e)
	}
})

//登陆接口

router.post('/login', async (req, res, next) => {
	//   res.send('respond with a resource');
	let { username, password } = req.body

	try {
		let user = await querySql('select * from user where username = ?', [
			username,
		])
		if (!user || user.length === 0) {
			res.send({ code: -1, msg: '该账号不存在' })
		} else {
			password = md5(`${password}${PWD_SALT}`)
			let result = await querySql(
				'select * from user where username = ? and password = ?',
				[username, password]
			)
			if (!result || result.length === 0) {
				res.send({ code: -1, msg: '账号或者密码不正确' })
			} else {
				let token = jwt.sign({ username }, PRIVARE_KEY, {
					expiresIn: EXPIRESD,
				})
				res.send({ code: 0, msg: '登陆成功', token: token })
			}
		}
	} catch (e) {
		console.log(e)
		next(e)
	}
})
//获取用户信息接口

router.get('/info', async (req, res, next) => {
	//   res.send('respond with a resource');
	// console.log(req.user);

	let { username } = req.user
	try {
		let userinfo = await querySql(
			'select nickname,head_img from user where username = ?',
			[username]
		)
		// console.log(userinfo);
		res.send({ code: 0, msg: '成功', data: userinfo[0] })
	} catch (e) {
		console.log(e)
		next(e)
	}
})

//头像上传接口
router.post('/upload', upload.single('head_img'), async (req, res, next) => {
	//   res.send('respond with a resource');
	// console.log(req.file)
	let imgPath = req.file.path.split('public')[1]
	let imgUrl = 'http://127.0.0.1:3001' + imgPath
	res.send({ code: 0, msg: '上传成功', data: imgUrl })
})

//用户信息更新接口
router.post('/updateUser', async (req, res, next) => {
	let { nickname, head_img } = req.body
	let { username } = req.user
	try {
		let result = await querySql(
			'update user set nickname = ? , head_img = ?  where username = ?',
			[nickname, head_img, username]
		)
		console.log(result)
		res.send({ code: 0, msg: '更新成功', data: null })
	} catch (e) {
		console.log(e)
		next(e)
	}
})

module.exports = router
