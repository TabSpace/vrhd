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

	var $browser = require('mods/view/browser');

	var ICON_SIZE = 72;
	var ICON_MARGIN = 36;

	var ICONS = {
		'chrome' : 'images/icon/icon1.png',
		'draw' : 'images/icon/icon2.png',
		'star' : 'images/icon/icon3.png',
		'download' : 'images/icon/icon4.png',
		'apple' : 'images/icon/icon5.png',
		'music' : 'images/icon/icon6.png',
		'tools' : 'images/icon/icon7.png',
		'weather' : 'images/icon/icon8.png',
		'entertainment' : 'images/icon/icon9.png'
	};

	var ICON_COUNT = Object.keys(ICONS).length;

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
				'visible' : false,
				'width' : this.plane.model.get('width'),
				'height' : this.plane.model.get('height')
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
			var plane = this.plane;
			model.on('change:visible', proxy('checkVisible'));
			$socket.on('touchpad:event', proxy('checkEvent'));
			plane.pointerModel.on('change', proxy('checkHover'));
			plane.model.on('change:bePointed', proxy('checkHover'));
		},
		setStyles : function(){
			var root = this.role('root');
			var width = this.model.get('width');
			var height = this.model.get('height');

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
		getBrowser : function(){
			if(!this.browser){
				this.browser = new $browser({
					plane : this.plane,
					parent : this.role('root')
				});
			}
			return this.browser;
		},
		openBrowser : function(){
			this.getBrowser().open();
		},
		checkHover : function(){
			var plane = this.conf.plane;
			var pos = plane.pointerModel.get();
			var planeWidth = this.model.get('width');
			var planeHeight = this.model.get('height');

			if(
				!plane.model.get('bePointed') ||
				!this.model.get('visible') ||
				!this.icons ||
				pos.x < 0 ||
				pos.y < 0 ||
				pos.x > planeWidth ||
				pos.y > planeHeight
			){
				this.unHover();
				return;
			}

			var hoverIndex = 0;
			var size = ICON_SIZE;
			var margin = ICON_MARGIN;
			
			var rowSize = Math.floor( planeWidth / (size + margin) );
			var rowPos = Math.floor( (pos.x - margin) / (size + margin) );
			var colPos = Math.floor( (pos.y - margin) / (size + margin) );
			var rowDelta = (pos.x - margin) % (size + margin);
			var colDelta = (pos.y - margin) % (size + margin);

			if(rowPos < 0 || colPos < 0){
				this.unHover();
				return;
			}

			if(rowDelta < size && colDelta < size){
				hoverIndex = ( colPos * rowSize + rowPos ) + 1;
			}else{
				this.unHover();
				return;
			}

			if(hoverIndex > ICON_COUNT){
				this.unHover();
				return;
			}

			if(hoverIndex){
				var hoverEl = this.icons.get(hoverIndex - 1);
				if(!hoverEl){
					this.unHover();
					return;
				}
				if(this.curHover && this.curHover.get(0) !== hoverEl){
					this.unHover();
				}
				var hoverIcon = $(hoverEl);
				this.curHover = hoverIcon;
				hoverIcon.css({
					'box-shadow' : 'rgba(255,255,255,0.5) 0 0 10px 10px'
				});
			}else{
				this.unHover();
			}
		},
		unHover : function(){
			if(!this.curHover){return;}
			this.curHover.css({
				'box-shadow' : 'none'
			});
			this.curHover = null;
		},
		checkEvent : function(event){
			event = event || {};
			if(!this.model.get('visible')){return;}
			if(!event.type){return;}
			if(!this.plane.model.get('bePointed')){return;}
			if(event.type === 'pinch-out'){
				this.hide();
			}else if(event.type === 'tap'){
				if(this.curHover){
					var name = this.curHover.attr('iconname');
					if(name === 'chrome'){
						this.openBrowser();
					}
				}
			}
		},
		fillIcons : function(){
			var src = '';
			var html = [];
			var root = this.role('root');
			var size = ICON_SIZE;
			var margin = ICON_MARGIN;
			var plane = this.plane;
			var planeWidth = this.model.get('width');
			var rowSize = Math.floor( planeWidth / (size + margin) );
			var rowPos = 0;
			var colPos = 0;
			var posX = 0;
			var posY = 0;
			var index = 0;
			$.each(ICONS, function(name, src){
				rowPos = index % rowSize;
				colPos = Math.floor(index / rowSize);
				posX = margin + rowPos * (size + margin);
				posY = margin + colPos * (size + margin);
				html.push([
					'<img',
						'class="icon"',
						'iconname="' + name + '"',
						'src="' + src + '"',
						'style="left:' + posX + 'px;top:' + posY + 'px"',
					'/>'
				].join(' '));
				index ++;
			});

			root.html(html.join(''));
			this.icons = root.find('.icon');
			this.icons.css({
				'border-radius' : size + 'px',
				'position' : 'absolute',
				'width' : size + 'px',
				'height' : size + 'px',
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

