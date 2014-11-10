/**
 * @fileoverview 表面层动画
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 动画表面层提供墙面切换的动画效果
 */
define('mods/view/surface/animate',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/view/surface/base');
	var $tpl = require('lib/kit/util/template');
	var $animateModel = require('mods/model/surface/animate');
	var $socket = require('mods/channel/socket');

	var TPL = $tpl({
		box : '<div class="surface" name="animate"></div>',
		cursor : [
			'<div class="laser-aiming-point">',
				'<div class="laser-ring"></div>',
			'</div>'
		]
	});

	var Animate = $base.extend({
		defaults : {
			name : 'animate',
			path : '',
			template : TPL.box,
			parent : null
		},
		build : function(){
			Animate.superclass.build.apply(this,arguments);
			this.buildCursor();
			this.setCursorVisibility();
			this.setCursor();
		},
		setEvents : function(){
			var proxy = this.proxy();
			var parent = this.parent;
			parent.pointerModel.on('change', proxy('setCursor'));
			parent.model.on('change:bePointed', proxy('setCursorVisibility'));
			$socket.on('touchpad:event', proxy('checkEvent'));
		},
		getModel : function(){
			this.model = new $animateModel({

			});
		},
		setStyles : function(){

		},
		buildCursor : function(){
			var root = this.role('root');
			if(!this.cursor){
				this.cursor = $(TPL.get('cursor')).appendTo(root);
				this.cursor.hide();
			}
		},
		setCursorVisibility : function(){
			var parentModel = this.parent.model;
			this.cursorVisible = parentModel.get('bePointed');
			if(this.cursorVisible){
				this.cursor.show();
			}else{
				this.cursor.hide();
			}
		},
		setCursor : function(){
			var parent = this.parent;
			var pointerModel = parent.pointerModel;
			if(this.cursorVisible){
				this.cursor.transform({
					'translateX' : pointerModel.get('x') + 'px',
					'translateY' : pointerModel.get('y') + 'px'
				});
			}
		},
		checkEvent : function(event){
			event = event || {};
			if(!this.cursorVisible){return;}
			if(!event.type){return;}
			if(event.type === 'tap'){
				var ring = this.cursor.find('.laser-ring');
				ring.hide();
				ring.reflow();
				ring.show();
			}
		},
		fxIn : function(){

		},
		fxOut : function(){

		}
	});

	module.exports = Animate;

});


