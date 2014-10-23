/**
 * @fileoverview html渲染组件的lithe模块封装，作为与全局对象的接口定义组件
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('lib/common/htmlRender',function(require,exports,module){

	var htmlRender = window.htmlRender || {};
	if($.type(htmlRender.ready) !== 'function'){
		htmlRender.ready = function(fn){
			if($.type(fn) === 'function'){
				fn();
			}
		};
	}

	[
		'renderItem'
	].forEach(function(methodName){
		htmlRender[methodName] = htmlRender[methodName] || $.noop;
	});

	module.exports = htmlRender;

});


