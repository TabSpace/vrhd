/**
 * @fileoverview 系统桌面
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 有电视的墙面可以成为系统桌面
 */
define('mods/view/desktop',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');

	var TPL = $tpl({
		box : [
			'<div class="desktop">',

			'</div>'
		]
	});

	var Desktop = $view.extend({
		defaults : {
			template : TPL.box,
			tv : null,
			plane : null
		},
		build : function(){
			var conf = this.conf;
			this.tv = conf.tv;
			this.plane = conf.plane;
			this.env = this.plane.env;
			this.model = new $model({
				'visible' : false
			});
			var root = this.role('root');
			root.appendTo(
				this.plane.surface.get('content').role('root')
			);
			this.setStyles();
		},
		setEvents : function(){
			var proxy = this.proxy();
			var model = this.model;
			model.on('change:visible', proxy('checkVisible'));
		},
		setStyles : function(){
			var root = this.role('root');
			var width = this.plane.model.get('width');
			var height = this.plane.model.get('height');

			this.model.set({
				width : width,
				height : height
			});

			root.css({
				'background-repeat' : 'no-repeat',
				'background-size' : 'cover',
				'background-image' : 'url(images/wp1.jpg)',
				'position' : 'absolute',
				'width' : width + 'px',
				'height' : height + 'px',
				'left' : 0,
				'top' : 0,
				'transform-style' : 'preserve-3d'
			});
		},
		show : function(){
			this.model.set('visible', true);
		},
		hide : function(){
			this.model.set('visible', false);
		},
		checkVisible : function(){
			var visible = this.model.get('visible');
			if(visible){
				this.fxIn();
			}else{
				this.fxOut();
			}
		},
		fxIn : function(){
			var tv = this.tv;
			var model = this.model;
			var root = this.role('root');
			var ratio = this.env.getRatio();
			var tvWidth = tv.conf.width * ratio;
			var tvHeight = tv.conf.screenHeight * ratio;
			var tvLeft = tv.conf.left * ratio;
			var tvTop = tv.conf.top * ratio;
			var scaleX = tvWidth / model.get('width');
			var scaleY  = tvHeight / model.get('height');

			root.css({
				'transform-origin' : '0% 0%'
			}).transform({
				'translateX' : tvLeft + 'px',
				'translateY' : tvTop + 'px',
				'translateZ' : '1px',
				'scaleX' : scaleX,
				'scaleY' : scaleY
			}).show();

			root.transit({
				'translateX' : 0,
				'translateY' : 0,
				'translateZ' : '1px',
				'scaleX' : 1,
				'scaleY' : 1
			}, 1000, 'ease-out', function(){
				root.transform({
					'translateZ' : 0
				});
			});
		},
		fxOut : function(){
			var that = this;
			var tv = this.tv;
			var model = this.model;
			var root = this.role('root');
			var ratio = this.env.getRatio();
			var tvWidth = tv.conf.width * ratio;
			var tvHeight = tv.conf.screenHeight * ratio;
			var tvLeft = tv.conf.left * ratio;
			var tvTop = tv.conf.top * ratio;
			var scaleX = tvWidth / model.get('width');
			var scaleY  = tvHeight / model.get('height');

			root.css({
				'transform-origin' : '0% 0%',
			}).transform({
				'translateX' : 0,
				'translateY' : 0,
				'translateZ' : '1px',
				'scaleX' : 1,
				'scaleY' : 1
			});

			root.transit({
				'translateX' : tvLeft + 'px',
				'translateY' : tvTop + 'px',
				'translateZ' : '1px',
				'scaleX' : scaleX,
				'scaleY' : scaleY
			}, 1000, 'ease-out', function(){
				root.transform({
					'translateZ' : 0
				}).hide();
			});
		}
	});

	module.exports = Desktop;

});

