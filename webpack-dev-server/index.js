const webpack = require('webpack')
// 配置对象config
const config = require('../webpack.config')
const Server = require('./lib/server/Server')

// 编译器对象compiler
const compiler = webpack(config)
const server = new Server(compiler) // Complier实例
server.listen(9090, 'localhost', () => {
  console.info('启动服务器9090')
})