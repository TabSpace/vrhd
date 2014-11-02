/**
 * @fileoverview 封装socket广播
 * @authors
  Tony.Liang <pillar0514@gmail.com>
 */
define('mods/channel/socket',function(require,exports,module){

	var $ = require('lib');
	var $events = require('lib/more/events');
	var $socket = require('mods/socket/client');

	$socket.init();

	var proxy = new $events();
	var Socket = {};

	Socket.trigger = function(name, data){
		name = name || '';
		data = data || {};
		$socket.set({
			name : name,
			data : data
		});
	};

	Socket.on = function(){
		proxy.on.apply(proxy, arguments);
	};

	Socket.off = function(name, fn){
		proxy.off.apply(proxy, arguments);
	};

	$socket.on('update', function(rs) {
		rs = rs || {};
		var name = rs.name || '';
		var data = rs.data || {};
		if(name){
			proxy.trigger(name, data);
		}
	});

	module.exports = Socket;

});
