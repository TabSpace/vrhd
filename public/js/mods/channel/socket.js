/**
 * @fileoverview 封装socket广播
 * @authors
  Tony.Liang <pillar0514@gmail.com>
 */
define('mods/channel/socket',function(require,exports,module){

	var $ = require('lib');
	var $events = require('lib/more/events');
	var $socket = require('mods/socket/client');
	var $timer = require('lib/kit/util/timer');

	$socket.init();

	var proxy = new $events();
	var Socket = {};
	var cacheData = null;

	$timer.setInterval(function(){
		if(cacheData){
			$socket.set(cacheData);
		}
		cacheData = null;
	});

	Socket.trigger = function(name, data){
		name = name || '';
		data = data || {};
		if(!cacheData){
			cacheData = {};
		}
		cacheData[name] = data;
	};

	Socket.on = function(){
		proxy.on.apply(proxy, arguments);
	};

	Socket.off = function(name, fn){
		proxy.off.apply(proxy, arguments);
	};

	$socket.on('update', function(rs) {
		rs = rs || {};
		$.each(rs, function(name, data){
			data = data || {};
			if(name){
				proxy.trigger(name, data);
			}
		});
	});

	module.exports = Socket;

});
