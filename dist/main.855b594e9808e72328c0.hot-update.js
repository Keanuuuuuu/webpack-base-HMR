/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatewebpack_base_hmr"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("let input = document.createElement('input')\r\ndocument.body.append(input)\r\n\r\nlet div = document.createElement('div')\r\ndocument.body.append(div)\r\n\r\nlet render = () => {\r\n  let title = __webpack_require__(/*! ./title.js */ \"./src/title.js\")\r\n  div.innerHTML = title\r\n}\r\n// 初始化调用render方法\r\nrender()\r\n// 如果当前模块支持热更新\r\nif(true) {\r\n  // 注册回调 当title.js变更后重新调用render方法\r\n  module.hot.accept([/*! ./title.js */ \"./src/title.js\"], render)\r\n}\n\n//# sourceURL=webpack://webpack-base-hmr/./src/index.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("5e0838f36dcbe5253f93")
/******/ })();
/******/ 
/******/ }
);