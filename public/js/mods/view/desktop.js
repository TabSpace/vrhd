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
			'<div class="desktop">',
				'<div class="icon-box" data-role="icon-box" style="display:none;"></div>',
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
				'background-size' : 'cover',
				'background-image' : 'url(images/wallpaper/wp1.jpg)',
				'position' : 'absolute',
				'width' : width + 'px',
				'height' : height + 'px',
				'left' : 0,
				'top' : 0,
				'transform-style' : 'preserve-3d'
			});

			this.role('icon-box').css({
				'position' : 'absolute',
				'width' : width + 'px',
				'height' : height + 'px',
				'left' : 0,
				'top' : 0,
				'transform-style' : 'preserve-3d'
			});
		},
		checkEvent : function(event){
			event = event || {};
			if(!this.model.get('visible')){return;}
			if(!event.type){return;}
			if(event.type === 'pinch-out'){
				if(this.plane.model.get('bePointed')){
					this.hide();
				}
			}
		},
		fillIcons : function(){
			var i = 1;
			var src = '';
			var html = [];
			var iconBox = this.role('icon-box');
			for(i = 1; i < 10; i++){
				src = 'images/icon/icon' + i + '.png';
				html.push('<div class="icon" iconid="icon' + i + '" style="background-image:url(' + src + ');"></div>');
			}
			iconBox.html(html.join(''));
			iconBox.find('.icon').each(function(){
				$(this).css({
					'animation' : 'drop-down 1s ease-out 1 ' + Math.random() + 's',
					'transform-style' : 'preserve-3d'
				});
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
		showIconBox : function(){
			this.role('icon-box').show();
		},
		hideIconBox : function(){
			this.role('icon-box').hide();
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

			root.show().css({
				'transform-origin' : '0% 0%'
			}).transform({
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
					'translateZ' : 0
				});
				that.showIconBox();
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
				$channel.trigger('on-desktop-hide');
				root.transform({
					'translateZ' : 0
				}).hide();
				that.hideIconBox();
			});
		}
	});

	module.exports = Desktop;

});

