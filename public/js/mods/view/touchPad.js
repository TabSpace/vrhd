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

			root.on('touchstart', proxy('onTouchStart'));
			root.on('touchmove', proxy('onTouchMove'));
			root.on('touchend', proxy('onTouchEnd'));
			root.on('gesturestart', proxy('onGestureStart'));
			root.on('gesturechange', proxy('onGestureChange'));
			root.on('gestureend', proxy('onGestureEnd'));

			root.on('tap', proxy('triggerTap'));
		},
		preventDefault : function(evt){
			if(evt.preventDefault){
				evt.preventDefault();
			}
		},
		onTouchStart : function(evt){
			this.endingAction = '';
			this.preventDefault(evt);
			this.checkAlphaLock(evt);
			if(evt.touches.length >= 2){
				this.startX0 = evt.touches[0].pageX;
				this.startX1 = evt.touches[1].pageX;
				this.startY0 = evt.touches[0].pageY;
				this.startY1 = evt.touches[1].pageY;
			}else if(evt.touches.length === 1){
				$socket.trigger('touchpad:event', {
					type : 'touchstart',
					x : evt.touches[0].pageX,
					y : evt.touches[0].pageY
				});
			}
		},
		onTouchMove : function(evt){
			this.preventDefault(evt);
			if(evt.touches.length >= 2){
				this.moveX0 = evt.touches[0].pageX;
				this.moveX1 = evt.touches[1].pageX;
				this.moveY0 = evt.touches[0].pageY;
				this.moveY1 = evt.touches[1].pageY;
			}else if(evt.touches.length === 1){
				$socket.trigger('touchpad:event', {
					type : 'touchmove',
					x : evt.touches[0].pageX,
					y : evt.touches[0].pageY
				});
			}
		},
		onTouchEnd : function(evt){
			this.preventDefault(evt);
			this.checkAlphaLock(evt);
			this.checkPushPull(evt);
			if(!this.endingAction){
				$socket.trigger('touchpad:event', {
					type : 'touchend'
				});
			}
		},
		onGestureStart : function(evt){
			this.preventDefault(evt);
			evt = evt.originalEvent || evt;
		},
		onGestureChange : function(evt){
			this.preventDefault(evt);
			evt = evt.originalEvent || evt;
		},
		onGestureEnd : function(evt){
			this.preventDefault(evt);
			evt = evt.originalEvent || evt;
			this.checkZoomOut(evt);
		},
		checkPushPull : function(evt){
			if(this.startX0 === null){return;}
			if(this.startX1 === null){return;}
			if(this.startY0 === null){return;}
			if(this.startY1 === null){return;}
			if(evt.touches.length <= 1){
				var deltaX0 = this.moveX0 - this.startX0;
				var deltaY0 = this.moveY0 - this.startY0;
				var deltaX1 = this.moveX1 - this.startX1;
				var deltaY1 = this.moveY1 - this.startY1;
				if(
					deltaY0 > 100 &&
					deltaY1 > 100 &&
					deltaX0 < Math.abs(deltaY0 / 2) &&
					deltaX0 > - Math.abs(deltaY0 / 2) &&
					deltaX1 < Math.abs(deltaY1 / 2) &&
					deltaX1 > - Math.abs(deltaY1 / 2)
				){
					$socket.trigger('touchpad:event', {
						type : 'pull'
					});
					this.endingAction = 'pull';
				}else if(
					deltaY0 < -100 &&
					deltaY1 < -100 &&
					deltaX0 < Math.abs(deltaY0 / 2) &&
					deltaX0 > - Math.abs(deltaY0 / 2) &&
					deltaX1 < Math.abs(deltaY1 / 2) &&
					deltaX1 > - Math.abs(deltaY1 / 2)
				){
					$socket.trigger('touchpad:event', {
						type : 'push'
					});
					this.endingAction = 'push';
				}

				this.startX0 = null;
				this.startX1 = null;
				this.startY0 = null;
				this.startY1 = null;
			}
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
		checkZoomOut : function(evt){
			if(evt.scale < 0.5){
				$socket.trigger('touchpad:event', {
					type : 'pinch-out'
				});
				this.endingAction = 'pinch-out';
			}else if(evt.scale > 2){
				$socket.trigger('touchpad:event', {
					type : 'pinch-in'
				});
				this.endingAction = 'pinch-in';
			}
		},
		triggerTap : function(){
			$socket.trigger('touchpad:event', {
				type : 'tap'
			});
			this.endingAction = 'tap';
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


