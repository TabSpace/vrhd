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
			this.startAlpha = 0;
			this.curAlpha = 0;
			this.offsetAlpha = 0;
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
			model.on('change:lockAlpha', proxy('computeOffsetAlpha'));
			root.on('touchstart', proxy('checkAlphaLock'));
			root.on('touchend', proxy('checkAlphaLock'));
			root.on('tap', proxy('triggerTap'));
		},
		//计算手机alpha与场景alpha的偏转角度
		//手机的alpha初始值是随机的，因此需要矫正流程，按下3个指头锁定alpha方向来进行矫正
		computeOffsetAlpha : function(){
			var model = this.model;
			var offsetAlpha = 0;
			if(model.get('lockAlpha')){
				this.startAlpha = this.curAlpha;
			}else{
				offsetAlpha = this.curAlpha - this.startAlpha;
				offsetAlpha = offsetAlpha > -180 ? offsetAlpha : 360 + offsetAlpha;
				offsetAlpha = offsetAlpha < 180 ? offsetAlpha : offsetAlpha - 360;
				this.offsetAlpha = offsetAlpha + this.offsetAlpha;
			}
		},
		//检查是否锁定alpha角度，用于调试手机指向的方向
		checkAlphaLock : function(event){
			var model = this.model;
			//同时按下3个指头时锁定alpha方向
			if(event.type === 'touchstart' && event.touches.length === 3){
				model.set('lockAlpha', true);
			}else{
				model.set('lockAlpha', false);
			}
		},
		orientation : function(event){
			var model = this.model;
			var alpha = event.alpha;
			var data = {
				'beta' : event.beta,
				'gamma' : event.gamma
			};
			this.curAlpha = alpha;
			if(!model.get('lockAlpha')){
				alpha = alpha - this.offsetAlpha;
				alpha = alpha > 0 ? alpha : 360 + alpha;
				alpha = alpha < 360 ? alpha : alpha - 360;
				data.alpha = alpha;
			}
			this.model.set(data);
		},
		triggerTap : function(){
			$socket.trigger('touchpad:event', {
				type : 'tap'
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


