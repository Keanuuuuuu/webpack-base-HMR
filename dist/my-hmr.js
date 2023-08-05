let currentHash // 当前hash
let lastHash // 上一个hash
class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(eventName, fn) {
    this.events[eventName] = fn
  }
  emit(eventName, ...args) {
    this.events[eventName](...args)
  }
}
let hotEmitter = new EventEmitter()

;(function (modules) {

var installedModules = {} // 存放模块缓存
let hotUpdate = {}

// 第九步：hotApply
function hotApply() {
	for(let moduleId in hotUpdate) { // ./src/title.js
		let oldModule = installedModules[moduleId] // 老title.js模块
		delete installedModules[moduleId] // 12从缓存中删除旧模块
		// 循环它所依赖的父模块
		
		oldModule.parents.forEach(parentModule => {
			// 取出父模块上的回调，如果有就执行
			console.log("oldModule",parentModule.hot);
			let cb = parentModule.hot._acceptedDependencies[moduleId]
			console.log(cb);
			// 13执行回调
			cb && cb()
		})
	}
}

// 第七步：定制函数调用需要的函数
window.webpackHotUpdatewebpack_base_hmr = function(chunkId, moreModules) {
	hotAddUpdateChunk(chunkId, moreModules)
}

// 第八步：hotAddUpdateChunk
function hotAddUpdateChunk(chunkId, moreModules) {
	for(let moduleId in moreModules) { // ./src/title.js
		modules[moduleId] = hotUpdate[moduleId] = moreModules[moduleId]
		// 替换其本身的模块的代码，为下一步实现更新
	}
	hotApply()
}

// 第六步：采用JSONP方式加载chunk文件
function hotDownloadUpdateChunk(chunkId) {
	let script = document.createElement('script')
	script.src = `main.${lastHash}.hot-update.js`
	document.head.appendChild(script)
	lastHash = currentHash
}

// 第五步：下载代码更改描述文件
function hotDownloadManifest() {
	return new Promise(function(resolve, reject) {
		let xhr = new XMLHttpRequest()
		let url = `main.${lastHash}.hot-update.json`
		xhr.open('get', url)
		xhr.responseType = 'json'
		xhr.onload = function() {
			resolve(xhr.response)
			console.log(xhr.response);
		}
		xhr.send()
	})
}

// 第四步：定义check方法
function hotCheck(){
	// hotCheck不是这个模块的内置方法，可以放到外面公用
	// {"c":["main"],"r":[],"m":[]}
	hotDownloadManifest().then(update => {
		let chunkIds = Object.keys(update.c) // ["main"]
		chunkIds.forEach(chunkId => {
			// 调用hotDownloadUpdateChunk
			hotDownloadUpdateChunk(chunkId) // main
		})
	}).catch((err) => {
		console.log(err);
	})
}
// 第三步：补充accept和check方法
function hotCreateModule(){
	let hot = {
		_acceptedDependencies : {},
		accept (deps, callback) {
			deps.forEach(dep => {
				hot._acceptedDependencies[dep] = callback
			});
		},
		check:hotCheck
	}
	return hot
}

// 第二步：维护模块间的父子关系
// parentModuleId为父模块的名称
function hotCreaterequire(parentModuleId){

	// 要想在下面的函数中通过传入子模块从而给他绑定父模块,就要根据传入的ID拿到 这次 要绑定的附魔看
	let parentModule = installedModules[parentModuleId]
	// 而且在父模块调用hotCreaterequire，说明父模块一定被加载过了
	if(!parentModule) return __webpack_require__

	let fn = function(childModuleId) {
		// 这里为什么说传入的moduleId标记为子模块parentModuleId，因为只有父模块和最初的这个JS才会调用__webpack_require__方法啊，所以其引用的都是子模块Id
		__webpack_require__(childModuleId)
		let childModule = installedModules[childModuleId]
		parentModule.children.push(childModule)
		childModule.parents.push(parentModule)
		console.log("childModule",childModule);
		console.log("parentModule",parentModule);
		return childModule.exports
	}

	return fn
}

// 第一步：实现在浏览器里正确渲染内容，也就是传入的JS代码能跑
// 方法是实现一个require方法，因为浏览器不认识commonJS的引入方法，我们再在外面封装一层
function __webpack_require__(moduleId){
	// 按照commonJS加载模块的逻辑在webpack里实现一个浏览器能看懂的
	// commonJS是有缓存功能的：所以定义installedModules
	if(installedModules[moduleId]){
		// 如果之前加载过这个模块。那么install里记录的一定有这个模块，那么我们直接返回即可
		return installedModules[moduleId]
	}
	let module = installedModules[moduleId] = {
		i:moduleId,
		l:false,
		exports:{},
		// 如果install里没有加载过此模块，那么我们定义一个module，其id为传进来的id，loaded（l）设为false，那么它导出的模块也是为空
		parents:[],
		children:[],
		hot:hotCreateModule()
	}
	modules[moduleId].call(module.exports,module,module.exports,hotCreaterequire(moduleId))
	// modules[moduleId]，modules是传入的那个对象，里面有两键值对，这样的写法就是拿到对应模块名称的后面那个函数，使用call可以执行这个函数
	/* call第一个参数为this指针；
		 第二个参数为module，是我们自己定义的module；
		 第三个参数为module.exports；
	 	 第四个参数为__webpack_require__，因为浏览器里没有require，你看下面函数中是不是require已经被替换为__webpack_require__
	*/
	module.l = true
	return module.exports
}

// return __webpack_require__("./src/index.js")
return hotCreaterequire("./src/index.js")("./src/index.js")

})(
	{
		// 按照打包后的代码中，传入参数
		"./src/index.js":function(module, exports, __webpack_require__){
			// 监听webpackHotUpdate消息
			__webpack_require__('webpack/hot/dev-server.js')
			// 连接websock服务器，如果服务器发给我hash就保存在currentHash里，如果服务器发送ok，我就发射webpackHotUpdate事件
			__webpack_require__('webpack-dev-server/client/index.js')
			let input = document.createElement('input')
			document.body.append(input)
			let div = document.createElement('div')
			document.body.append(div)
			let render = () => {
				let title = __webpack_require__('./src/title.js')
				div.innerHTML = title
			}
			render()
			// 如果当前模块支持热更新
			if(module.hot) {
				module.hot.accept(['./src/title.js'], render)
			}
		},

		"./src/title.js":function(module, exports, __webpack_require__){
			module.exports = 'HMR'
		},

		"webpack-dev-server/client/index.js": function(module, exports) {

			// 刚才的消息订阅与发布类正好放到上面大家共享

			// 1连接websocket服务器
			const socket = window.io('/')
			// 2监听hash事件，保存此hash值
			socket.on('hash', (hash) => {
				currentHash = hash
			})
			// 3监听ok
			socket.on('ok', () => {
				console.info('ok')
				reloadApp()
			})
			// 4发射webpackHotUpdate事件
			function reloadApp() {
				hotEmitter.emit('webpackHotUpdatewebpack_base_hmr')
			}
		},
		"webpack/hot/dev-server.js": function(module, exports) {
			// 5监听webpackHotUpdate事件
			hotEmitter.on('webpackHotUpdatewebpack_base_hmr', () => {
				console.info('hotCheck')
				if(!lastHash) { // 没有lastHash说明没上一次的编译结果，说明就是第一次渲染
					lastHash = currentHash
					console.log('lashHash',lastHash, 'currentHash', currentHash)
					// 第一次渲染是不需要热替换的，直接返回
					return
				}
				console.log('lashHash',lastHash, 'currentHash', currentHash)
				// 6hotCheck，走到这说明不是第一次渲染，我要向服务器发送check请求，拉去最新模块代码
				module.hot.check()
			})
		}
	}
)