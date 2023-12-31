const express = require('express')
const http = require('http')
const path = require('path')
// const MemoryFS = require('memory-fs') // 基于内存
const fs = require('fs-extra') // 基于硬盘文件系统
fs.join = path.join
const mime = require('mime') // 这个模块可以从文件中拿到类型
const socketIo = require('socket.io') // 创建socket服务
const updateCompiler = require('./utils/updateCompiler') // 源码也是这样写的

class Server {
  constructor(compiler) {
    this.compiler = compiler // 保存编译器对象
    updateCompiler(compiler) // 入口注入2个文件
    this.setupApp() // 创建express
    this.currentHsah // 当前的hash值，每次编译都会产生一个hash值
    this.clientsocketList = [] // 存放着所有通过websocket链接到服务器的客户端
    this.setupHooks() // 建立钩子
    this.setupDevMiddleware()
    this.routes() // 配置路由
    this.createServer() // 创建HTTP服务器，以app作为路由
    this.createSocketServer() // 创建socket服务器
  }
  createSocketServer() {
    // websocket协议握手时需要依赖http服务器
    const io = socketIo(this.server)
    // 服务器要监听客户端的连接，当客户端连接上来后，socket代表跟这个客户端连接对象
    io.on('connection', (socket) => {
      console.info('一个新的客户端已经连接上了')
      // 每当链接上一个新的客户端，发送当前的hash值
      this.clientsocketList.push(socket) // 把新的socket方到数组
      socket.emit('hash', this.currentHsah) // 给客户端发送最新hash
      socket.emit('ok') // 给客户端发送ok
      // 如果这个客户端断开连接了，要把它从数组中删掉
      socket.on('disconnect', () => {
        let index = this.clientsocketList.indexOf(socket)
        this.clientsocketList.splice(index, 1)
      })
    })
  }
  // 创建http服务器
  createServer() {
    // 通过http模块创建一个普通的http服务器
    this.server = http.createServer(this.app)
  }
  routes() {
    let {compiler} = this
    let config = compiler.options
    this.app.use(this.middleware(config.output.path))
    // 这里拿到的是dist目录路径
  }
  // 创建webpack-dev-middleware
  setupDevMiddleware() {
    this.middleware = this.webpackDevMiddleware() // 返回一个express中间件
  }
  webpackDevMiddleware() {
    let {compiler} = this
    // 以监听模式启动编译，如果文件发生变更，会重新编译
    compiler.watch({}, () => {
      console.info('监听模式启动编译')
    })
    // let fs = new MemoryFS() // 内存文件系统实例
    // 打包后文件写入内存文件系统，读的时候也从内存文件系统里读
    this.fs = compiler.outputFileSystem = fs
    // 这里将fs作为compiler.outputFileSystem的值，说明，我通过设置把webpack的打包结果放在磁盘里，最后再赋值给this.fs以供后续操作

    // 返回一个中间件，用来响应客户端对于产出文件的请求
    return (staticDir) => { // 静态文件根目录，它其实就是输出目录 dist目录
      return (req, res, next) => { // 这个函数是实际的中间件函数，用于处理客户端对静态资源文件的请求
        let {url} = req; // 得到请求路径
        if(url === '/favicon.ico') {
          return res.sendStatus(404)
        }
        url === '/' ? url = '/index.html' : null
        // 得到要访问的静态路径 /index.html /main.js
        let filePath = path.join(staticDir, url)
        console.info('filePath', filePath) 
        // 这里拿到的是绝对路径，就是下面这个样子的路径
        // D:\前端工程化\webpack-base-HMR\dist\index.html
        try {
          // 返回此路径上的文件的描述对象，如果此文件不存在会抛异常
          let statObj = this.fs.statSync(filePath)
          console.info('statObj', statObj)
          if (statObj.isFile()) {
            let content = this.fs.readFileSync(filePath) // 读取文件内容，如果这里两个返回值类型函数用到的不是箭头函数，那么this的指向将出现问题，将拿不到刚刚打包好存入的文件
            res.setHeader('Content-Type', mime.getType(filePath)) // 设置响应头，告诉浏览器文件内容格式
            res.send(content) // 把内容发送给浏览器
          } else {
            console.log(111);
            return res.sendStatus(404)
          }
        } catch(error) {
            console.log(error);
            return res.sendStatus(404)
        }
      }
    }
  } 
  setupHooks() {
    let { compiler } = this
    // 监听编译完成事件，当编译完成后会调用此钩子函数
    compiler.hooks.done.tap('webpack-dev-server', (stats) => {
      // stats描述对象，里面放着打包后的结果比如：hash值
      console.info('hash', stats.hash)
      this.currentHsah = stats.hash
      // 会向所有的客户端进行广播，告诉客户端已经编译成功，新的模块代码已经生成
      this.clientsocketList.forEach(socket => {
        socket.emit('hash', this.currentHsah) // 给客户端发送最新hash
        socket.emit('ok') // 给客户端发送ok
      })
    })
  }
  // 创建express的app实例
  setupApp() {
    this.app = express() // 得到http应用对象
  }
  // 监听服务
  listen(port, host, callback) {
    this.server.listen(port, host, callback)
  }
}

module.exports = Server