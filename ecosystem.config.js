module.exports = {
	apps: [
		{
			name: 'app',
			script: './bin/www',

			// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
			// args: 'one two',
			instances: 1,
			autorestart: true,
			watch: true,
			ignore_watch: ['node_modules', 'logs'], //不用监听的文件
			max_memory_restart: '1G',
			error_file: './logs/app-err.log', //错误日志文件
			out_file: './logs/app-out.log',
			log_date_format: 'YYYY-MM-DD HH:mm:ss', //给每行错误日志加上时间
			env: {
				NODE_ENV: 'development', //开发环境
			},
			env_production: {
				NODE_ENV: 'production', //生产环境
			},
		},
	],

	deploy: {
		production: {
			user: 'node',
			host: '192.168.136.129',
			ref: 'origin/master',
            repo: 'git@github.com:Aphrote/blog.git',
            path: '/usr/local/myProject',
            ssh_options:"StrictHostKeyChecking=no",
			'post-deploy':
                'npm install && pm2 reload ecosystem.config.js --env production',
                "env":{
                    "NODE_ENV":"production"
                }
		},
	},
}
