/**
 * @fileoverview 全景展示
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 用于展示全景照片
 */
define('mods/view/panorama',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');
	var $socket = require('mods/channel/socket');
	var $channel = require('lib/common/channel');
	var $arcToDeg = require('lib/kit/math/arcToDeg');

	var TPL = $tpl({
		box : [
			'<div class="panorama">',
				'<div class="panorama-item"></div>',
				'<div class="panorama-item"></div>',
				'<div class="panorama-item"></div>',
				'<div class="panorama-item"></div>',
				'<div class="panorama-item"></div>',
				'<div class="panorama-item"></div>',
				'<div class="panorama-item"></div>',
				'<div class="panorama-item"></div>',
			'</div>'
		]
	});

	var Panorama = $view.extend({
		defaults : {
			ground : null,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			var root = this.role('root');
			this.model = new $model({

			});
			this.ground = conf.ground;
			root.appendTo(this.ground);
			this.screens = root.find('.panorama-item');
			this.setStyles();
			this.buildScreen();
		},
		setEvents : function(){
			var model = this.model;
			var proxy = this.proxy();
			model.on('change:visible', proxy('checkVisible'));
			$channel.on('back-to-room', proxy('hide'));
		},
		setStyles : function(){
			var root = this.role('root');
			root.css({
				'position' : 'absolute',
				'width' : '200px',
				'height' : '200px',
				'left' : '50%',
				'top' : '50%',
				'margin-top' : '-100px',
				'margin-left' : '-100px',
				'transform-origin' : '50% 50%',
				'transform-style' : 'preserve-3d',
				'transform' : 'rotateX(90deg) rotateZ(180deg)'
			});
		},
		buildScreen : function(){
			var screenCount = this.screens.length;
			var viewingAngle = 180;
			var distance = 400;
			var itemHeight = 400;
			var itemAngle = viewingAngle / screenCount;
			var itemWidth = 2 * Math.sin( $arcToDeg(itemAngle / 2) ) * distance;
			this.screens.each(function(index){
				var el = $(this);
				el.css({
					'background-color' : '#fff',
					'width' : itemWidth + 'px',
					'height' : itemHeight + 'px'
				}).transform({
					// 'rotateY' : '',
					'translateZ' : - distance + 'px'
				});
			});
		},
		fxIn : function(){

		},
		fxOut : function(){

		},
		checkVisible : function(){
			if(this.model.get('visible')){
				this.fxIn();
			}else{
				this.fxOut();
			}
		},
		show : function(){
			this.model.set('visible', true);
		},
		hide : function(){
			this.model.set('visible', false);
			$channel.trigger('room-show-face');
		}
	});

	module.exports = Panorama;

});

