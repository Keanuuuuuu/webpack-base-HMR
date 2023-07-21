let input = document.createElement('input')
document.body.append(input)

let div = document.createElement('div')
document.body.append(div)

let render = () => {
  let title = require('./title.js')
  div.innerHTML = title
}
// 初始化调用render方法
render()
// 如果当前模块支持热更新
if(module.hot) {
  // 注册回调 当title.js变更后重新调用render方法
  module.hot.accept(['./title.js'], render)
}