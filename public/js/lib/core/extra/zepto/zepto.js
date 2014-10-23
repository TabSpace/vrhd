/**
 * @fileoverview zepto 函数扩充插件 
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('lib/core/extra/zepto/zepto',function(require,exports,module){

	var $ = require('lib/core/zepto/zepto');

	var console = window.console;

	//ie7 console.log是一个对象
	var enableLog = console && typeof console.log === 'function';

	$.extend($, {
		noop : function(){},
		log : function(){
			if(enableLog){
				console.log.apply(console, arguments);
			}
		},
		hyphenate : function(str){
			return str.replace(/[A-Z]/g, function($0){
				return '-' + $0.toLowerCase();
			});
		}
	});

	$.extend($.fn, {
		//判断事件是否发生在元素内部(包括元素本身)
		occurInside : function(event){
			if(this.length && event && event.target){
				return this[0] === event.target || this.has(event.target).length;
			}
		},
		//是否存在属性
		hasAttr : function(name){
			return this[0] && this[0].hasAttribute(name);
		},
		reflow : function(){
			var reflow = this.size() && this.get(0).clientLeft;
			return this;
		}
	});

});



