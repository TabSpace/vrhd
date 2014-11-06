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

	var TPL = $tpl({
		box : '<div class="surface" name="animate"></div>'
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
			this.setCursor();
		},
		setEvents : function(){
			
		},
		getModel : function(){
			this.model = new $animateModel({

			});
		},
		setStyles : function(){

		},
		setCursor : function(){
			var conf = this.conf;
			var model = this.model;
			var root = this.role('root');
			var parent = conf.parent;
			this.cursor = $('<div class="laser-aiming-point"/>').appendTo(root);

			var parentName = parent.conf.name;
			var pos = parent.getVerticalPos();
			this.cursor.transform({
				'translateX' : pos.x + 'px',
				'translateY' : pos.y + 'px'
			});
		},
		fxIn : function(){

		},
		fxOut : function(){
			
		}
	});

	module.exports = Animate;

});
