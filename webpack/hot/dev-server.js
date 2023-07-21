
/* 
  存2个hash，一个是上一个hash，一个是当前hash
*/
let lastHash
let currentHash
hotEmitter.on('webpackHotUpdatewebpack_base_hmr', () => {
  if(!lastHash) { // 没有lastHash说明没上一次的编译结果，说明就是第一次渲染
    lastHash = currentHash
    console.log('lashHash',lastHash, 'currentHash', currentHash)
    // 第一次渲染是不需要热替换的，直接返回
    return
  }
  console.log('lashHash',lastHash, 'currentHash', currentHash)
  module.hot.check()
})