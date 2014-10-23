/**
 * @fileoverview 包装为一个队列，按设置的时间间隔触发
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 * @param {Function} fn 要延迟触发的函数
 * @param {Number} delay 延迟时间[ms]
 * @param {Object} bind 函数的this指向
 * @example
	var $queue = require('lib/kit/func/queue');
	var t1 = Date.now();
	var doSomthing = $queue(function(index){
		console.debug(index + ':' + (Date.now() - t1));
	}, 200);
	//每隔200ms输出一个日志。
	for(var i = 0; i < 10; i++){
		doSomthing(i);
	}
 */
define('lib/kit/func/queue',function(require,exports,module){

	module.exports = function(fn, delay, bind){
		var timer = null;
		var queue = [];
		return function(){
			bind = bind || this;
			var args = arguments;
			queue.push(function(){
				fn.apply(bind, args);
			});
			if(!timer){
				timer = setInterval(function(){
					if(!queue.length){
						clearInterval(timer);
						timer = null;
					}else{
						queue.shift()();
					}
				}, delay);
			}
		};
	};
});

