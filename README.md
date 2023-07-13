# webpack-base-HMR

1、dist目录下的文件打包的是什么啊

2、生成的main.oldhash.hot.update是由webpack每次打包自动生成的（这应该是tree-shaking）

3、加载的模块是以文件为单位吗？这个并不是，为什么会产生这样的错觉呢，是因为在设置热更新监听的模块时，是以： `module.hot.accept('./title.js',render)`文件为模块单位来监听的，如果仅仅只是编写HTML、CSS、JS的项目，想要实现热更新就要正确的监听所有的“模块”

4、JSON文件告诉我们哪个代码模块发生了改变、JS文件告诉我们这个代码模块里最新的模块代码是什么