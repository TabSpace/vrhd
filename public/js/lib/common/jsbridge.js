/**
 * @fileoverview 封装与客户端的交互方式
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 * @example
	var $jsbridge = require('lib/common/jsbridge');
	var bridge = new $jsbridge([
		'clientMethod1',
		'clientMethod2',
		'clientMethod3'
	]);

	//简单的调用方法，不传递数据
	bridge.request('clientMethod1');

	//简单的调用方法，传递数据
	bridge.request('clientMethod2', {
		data : {
			a : 1,
			b : 2
		}
	});

	//传递数据，并要求一个回调
	bridge.request('clientMethod3', {
		data : {
			a : 1,
			b : 2
		},
		callback : function(rs){
			//get callback json : rs
		}
	});

	//注册一个广播事件
	//addEventListener默认就在白名单内
	bridge.request('addEventListener', {
		event : 'render',
		callback : 'window.listener.trigger("render", [data])'
	});
 */

define('lib/common/jsbridge',function(require,exports,module){

	var $ = require('lib');
	var $getUniqueKey = require('lib/kit/util/getUniqueKey');
	var $queue = require('lib/kit/func/queue');

	var $win = window;

	var PREFIX = 'jsbridge';
	var CALLBACK_NAME = '_callback_';
	var PROTOCOL = 'jsbridge://';

	var container;

	//封装要传递到客户端的数据
	var getPostMessage = function(conf, name){
		var message;

		//与客户端约定，callback属性必须是一个字符串
		if(conf.callback && $.type(conf.callback) === 'function'){
			$win[CALLBACK_NAME + name] = conf.callback;
			//[data]为一个占位符，客户端会将其替换为一个JSON对象
			conf.callback = 'try{window["' + CALLBACK_NAME + name + '"]([data]);}catch(e){}';
		}else if($.type(conf.callback) !== 'string'){
			delete conf.callback;
		}

		//客户端不需要timeout属性
		delete conf.timeout;

		try{
			//客户端读取到的实际上是一个JSON字符串
			message = JSON.stringify(conf);
		}catch(e){
			console.error('JSON stringify ' + name + ' error!');
		}finally{
			if(window.console && console.info && lithe.debug){
				console.info('jsBridge send:', conf);
			}
		}

		return message;
	};

	var jsBridge = function(whitelist){
		this.whitelist = {
			'addEventListener' : true
		};
		if($.isArray(whitelist)){
			whitelist.forEach(this.define.bind(this));
		}
	};

	var iframe;

	var iframeRequest = function(src){
		if(!container){
			container = $('<div></div>').hide().appendTo(document.body);
		}
		if(!iframe){
			iframe = $(document.createElement('iframe'));
			iframe.attr('src', src);
			iframe.hide().appendTo(container);
		}else{
			iframe.attr('src', src);
		}
	};

	//JS的一个线程时段内修改src属性，客户端无法捕获到src的变化
	//所以使用计时器打断线程，以队列方式发送请求
	//队列触发间隔时间太短有可能导致客户端(主要是IOS)无法接收到完整请求队列，因此限制间隔时间为20ms.
	iframeRequest = $queue(iframeRequest, 20);

	//提供白名单机制, 要求项目中维护白名单，以增强项目可维护性
	jsBridge.prototype = {
		define : function(name){
			this.whitelist[name] = true;
		},
		undefine : function(name){
			delete this.whitelist[name];
		},
		request : function(method, spec){
			var conf = $.extend({
				//单位(ms)，这个时间之后，会销毁全局变量与iframe，释放内存
				timeout : 3 * 1000,
				onTimeout : $.noop
			}, spec);

			if(!method){return;}
			if(!this.whitelist[method]){return;}
			conf.method = method;

			var timeout = conf.timeout;
			var name = PREFIX + $getUniqueKey();
			var src = PROTOCOL + name;
			var message = getPostMessage(conf, name);
			
			//客户端可以暴露一个对象接收数据
			//规范接收数据的对象名称为:jsBridge, 方法名称为:process
			if(
				$win.jsBridge &&
				$.isFunction($win.jsBridge.process)
			){
				//存在客户端暴露的方法，直接调用该方法传递数据
				$win.jsBridge.process(message);
			}else{
				//不存在客户端暴露的方法，则暴露一个全局变量，用iframe.src通知客户端来读取
				$win[name] = message;
				iframeRequest(src);
			}

			if(timeout){
				setTimeout(function(){
					delete $win[name];
					delete $win[CALLBACK_NAME + name];
					if($.type(conf.onTimeout) === 'function'){
						conf.onTimeout();
					}
				}, timeout);
			}
		}
	};

	module.exports = jsBridge;

});
