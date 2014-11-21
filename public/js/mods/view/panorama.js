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
	var $degToArc = require('lib/kit/math/degToArc');
	var $touchPadModel = require('mods/model/touchPad');

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

	var PANO_IMAGES = [
		'/images/pano/pano1.jpg',
		'/images/pano/pano2.jpg',
		'/images/pano/pano3.jpg',
		'/images/pano/pano4.jpg'
	];

	var Panorama = $view.extend({
		defaults : {
			ground : null,
			env : null,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			var root = this.role('root');
			this.env = conf.env;
			this.model = new $model({
				panoSrc : '',
				panoAngle : 180,
				panoWidth : 0,
				panoHeight : 0
			});
			this.ground = conf.ground;
			root.appendTo(this.ground);
			this.screens = root.find('.panorama-item');
			this.setStyles();
			this.loadPano();
		},
		setEvents : function(){
			var model = this.model;
			var proxy = this.proxy();
			model.on('change:visible', proxy('checkVisible'));
			$channel.on('back-to-room', proxy('hide'));
		},
		setStyles : function(){
			var root = this.role('root');
			var ratio = this.env.getRatio();
			var room = this.env.getObjByPath('vr.scene.house.room');
			var eyeHeight = 1.4;
			if(room && room.personModel){
				eyeHeight = room.personModel.get('eyeHeight');
			}
			var eyeHeightPx = eyeHeight * ratio;
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
				'transform' : 'rotateX(90deg) rotateZ(180deg) translateY(-' + eyeHeightPx + 'px)'
			});
		},
		render : function(){
			var model = this.model;
			var screenCount = this.screens.length;
			var panoSrc = model.get('panoSrc');
			var viewingAngle = model.get('panoAngle');
			var itemWidth = model.get('panoWidth') / screenCount;
			var itemHeight = model.get('panoHeight');
			var itemAngle = viewingAngle / screenCount;
			var distance = itemWidth / (2 * Math.sin( $degToArc(itemAngle / 2) ));
			var startDeg = (screenCount / 2) * itemAngle - itemAngle / 2;

			distance = distance - distance / 45;

			this.screens.each(function(index){
				var el = $(this);
				var deg = startDeg - index * itemAngle;
				var posX = - index * itemWidth;
				el.css({
					'position' : 'absolute',
					'top' : '50%',
					'left' : '50%',
					'margin-left' : itemWidth / 2 + 'px',
					'margin-top' : itemHeight / 2 + 'px',
					'background-color' : '#fff',
					'background-image' : 'url(' + panoSrc + ')',
					'background-repeat' : 'no-repeat',
					'background-position' : posX + 'px 0',
					'width' : itemWidth + 'px',
					'height' : itemHeight + 'px'
				}).transform({
					'rotateY' : deg + 'deg',
					'translateZ' : - distance + 'px',
					'translateY' : - itemHeight + 'px'
				});
			});
		},
		loadPano : function(){
			var that = this;
			var model = this.model;
			var src = PANO_IMAGES[3];
			var img = new Image();
			img.onload = function(){
				model.set({
					panoSrc : src,
					panoWidth : img.width,
					panoHeight : img.height
				});
				that.render();
			};
			img.src = src;
		},
		fxIn : function(){
			this.role('root').show();
		},
		fxOut : function(){
			this.role('root').hide();
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

