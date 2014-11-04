/**
 * @fileoverview 触控板
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 提供touch操作和指向标记
 */
define('mods/view/touchPad',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $touchPadModel = require('mods/model/touchPad');
	var $socket = require('mods/channel/socket');

	var TouchPad = $view.extend({
		defaults : {
			node : null
		},
		build : function(){
			this.model = $touchPadModel;
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			var root = this.role('root');
			var model = this.model;
			if(root.get(0)){
				if (window.DeviceOrientationEvent) {
					window.addEventListener('deviceorientation', proxy('orientation'));
				}
				model.on('change', proxy('sync'));
			}else{
				$socket.on('touchpad:sync', proxy('onSync'));
			}
		},
		orientation : function(event){
			this.model.set({
				'alpha' : event.alpha,
				'beta' : event.beta,
				'gamma' : event.gamma
			});
		},
		sync : function(){
			var data = this.model.get();
			$socket.trigger('touchpad:sync', data);
		},
		onSync : function(data){
			data = data || {};
			this.model.set(data);
		}
	});

	module.exports = TouchPad;

});


