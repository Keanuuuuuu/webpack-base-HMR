(function (modules) {

var installedModules = {} // 存放模块缓存

// 第一步：实现在浏览器里正确渲染内容，也就是传入的JS代码能跑
// 方法是实现一个require方法，因为浏览器不认识commonJS的引入方法，我们再在外面封装一层
function __webpack_require__(moduleId){
	// 按照commonJS加载模块的逻辑在webpack里实现一个浏览器能看懂的
	// 1、commonJS是有缓存功能的：定义installedModules
	if(installedModules[moduleId]){
		// 如果之前加载过这个模块。那么install里记录的一定有这个模块，那么我们直接返回即可
		return installedModules[moduleId]
	}
	let module = installedModules[moduleId] = {
		i:moduleId,
		l:false,
		exports:{}
		// 如果install里没有加载过此模块，那么我们定义一个module，其id为传进来的id，loaded（l）设为false，那么它导出的模块也是为空
	}
	modules[moduleId].call(module.exports,module,module.exports,__webpack_require__)
	// modules[moduleId]，modules是传入的那个对象，里面有两键值对，这样的写法就是拿到对应模块名称的后面那个函数，使用call可以执行这个函数
	/* call第一个参数为this指针；
		 第二个参数为module，是我们自己定义的module；
		 第三个参数为module.exports；
	 	 第四个参数为__webpack_require__，因为浏览器里没有require，你看下面函数中是不是require已经被替换为__webpack_require__
	*/
	module.l = true
	return module.exports
}

return __webpack_require__("./src/index.js")

})(
	{
		// 按照打包后的代码中，传入两个参数
		"./src/index.js":function(module, exports, __webpack_require__){
			let input = document.createElement('input')
			document.body.append(input)

			let div = document.createElement('div')
			document.body.append(div)

			let render = () => {
				let title = __webpack_require__('./src/title.js')
				div.innerHTML = title
			}
			// 初始化调用render方法
			render()
			// 如果当前模块支持热更新
			if(module.hot) {
				// 注册回调 当前index.js模块可以接受title.js模块的更新，当title.js变更后重新调用render方法
				module.hot.accept(['./title.js'], render)
			}
		},

		"./src/title.js":function(module, exports, __webpack_require__){
			module.exports = 'title1'
		}
	}
)