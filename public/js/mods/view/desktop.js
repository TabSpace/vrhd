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
	var $socket = require('mods/channel/socket');
	var $channel = require('lib/common/channel');

	var TPL = $tpl({
		box : [
			'<div class="desktop"></div>'
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
			this.fillIcons();
		},
		setEvents : function(){
			var proxy = this.proxy();
			var model = this.model;
			model.on('change:visible', proxy('checkVisible'));
			$socket.on('touchpad:event', proxy('checkEvent'));
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
				'background-image' : 'url(images/wallpaper/wp1.jpg)',
				'position' : 'absolute',
				'width' : width + 'px',
				'height' : height + 'px',
				'left' : 0,
				'top' : 0,
				'transform-origin' : '0% 0%',
				'transform-style' : 'preserve-3d'
			});
		},
		checkEvent : function(event){
			event = event || {};
			if(!this.model.get('visible')){return;}
			if(!event.type){return;}
			if(event.type === 'pinch-out'){
			//	if(this.plane.model.get('bePointed')){
					this.hide();
			//	}
			}
		},
		fillIcons : function(){
			var i = 1;
			var src = '';
			var html = [];
			var root = this.role('root');
			for(i = 1; i < 10; i++){
				src = 'images/icon/icon' + i + '.png';
				html.push('<img class="icon" iconid="icon' + i + '" src="images/icon/icon' + i + '.png"/>');
			}
			root.html(html.join(''));
			root.find('.icon').css({
				'background-repeat' : 'no-repeat',
				'display' : 'inline-block',
				'width' : '72px',
				'height' : '72px',
				'float' : 'left',
				'margin' : '36px',
				'opacity' : 0
			}).transform({
				'translateZ' : '150px'
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
		showIcons : function(){
			this.role('root').find('.icon').each(function(){
				var el = $(this);
				setTimeout(function(){
					el.transit({
						'opacity' : 1,
						'translateZ' : 0
					}, 1000, 'ease-out', function(){
						el.css('transform', '');
					});
				}, Math.random() * 1000);
			});
		},
		hideIcons : function(){
			this.role('root').find('.icon').css({
				'opacity' : 0
			}).transform({
				'translateZ' : '150px'
			});
		},
		fxIn : function(){
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

			root.show().transform({
				'translateX' : tvLeft + 'px',
				'translateY' : tvTop + 'px',
				'translateZ' : '1px',
				'scaleX' : scaleX,
				'scaleY' : scaleY
			});

			root.transit({
				'translateX' : 0,
				'translateY' : 0,
				'translateZ' : '1px',
				'scaleX' : 1,
				'scaleY' : 1
			}, 1000, 'ease-out', function(){
				root.transform({
					'translateZ' : 0,
				});
				that.showIcons();
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

			root.transform({
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
				that.hideIcons();
				root.hide();
				$channel.trigger('on-desktop-hide');
			});
		}
	});

	module.exports = Desktop;

});

