/**
 * @fileoverview VR浏览器
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 在VR场景显示的浏览器
 */
define('mods/view/browser',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $socket = require('mods/channel/socket');
	var $channel = require('lib/common/channel');

	var URL = '/dpool/blog/s/blog_49ae54740102v6t7.html?pos=99&vt=4';

	var TPL = $tpl({
		box : [
			'<div class="browser">',
				'<div data-role="box"></div>',
			'</div>'
		]
	});

	var Browser = $view.extend({
		defaults : {
			plane : null,
			parent : null,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.plane = conf.plane;
			this.role('root').appendTo(conf.parent);
			this.model = new $model({
				'visible' : false,
				'width' : this.plane.model.get('width'),
				'height' : this.plane.model.get('height')
			});
			this.setStyles();
		},
		setEvents : function(){
			var model = this.model;
			var plane = this.plane;
			var proxy = this.proxy();
			model.on('change:visible', proxy('checkVisible'));
			$socket.on('touchpad:event', proxy('checkEvent'));
			plane.pointerModel.on('change', proxy('checkHover'));
			plane.model.on('change:bePointed', proxy('checkHover'));
		},
		setStyles : function(){
			var model = this.model;
			var root = this.role('root');
			root.css({
				'position' : 'absolute',
				'top' : 0,
				'left' : 0,
				'width' : model.get('width') + 'px',
				'height' : model.get('height') + 'px',
				'overflow' : 'hidden',
				'transform-origin' : '50% 50%',
				'transform-style' : 'preserve-3d'
			}).transform({
				'translateZ' : 0
			});
			this.role('box').css({
				'position' : 'absolute',
				'top' : 0,
				'left' : 0,
				'width' : model.get('width') + 'px',
				'height' : model.get('height') + 'px',
				'background-color' : '#fff',
			}).transform({
				'translateY' : model.get('height') + 'px'
			});
		},
		fxIn : function(){
			var that = this;
			var model = this.model;
			var root = this.role('root');
			root.show();
			this.role('box').transform({
				'translateY' : model.get('height') + 'px'
			}).transit({
				'translateY' : 0
			}, 500, 'ease-out', function(){
				that.loadPage();
			});
		},
		fxOut : function(){
			var that = this;
			var model = this.model;
			var root = this.role('root');
			this.role('box').transit({
				'translateY' : model.get('height') + 'px'
			}, 500, 'ease-out', function(){
				root.hide();
				if(that.plane.desktop){
					that.plane.desktop.focus();
				}
			});
		},
		checkHover : function(){
			var plane = this.conf.plane;
			var pos = plane.pointerModel.get();
			if(
				plane.model.get('bePointed') &&
				this.model.get('visible')
			){
				this.model.set({
					'hover' : true,
					'pointerX' : pos.x,
					'pointerY' : pos.y
				});
			}else{
				this.model.set({
					'hover' : false,
					'pointerX' : 0,
					'pointerY' : 0
				});
			}
		},
		checkEvent : function(event){
			event = event || {};
			if(!event.type){return;}
			if(!this.model.get('visible')){return;}
			if(!this.model.get('hover')){return;}
			if(event.type === 'pull'){
				this.hide();
			}else{
				this.passEvents(event);
			}
		},
		passEvents : function(evt){
			var model = this.model;
			var iframe = this.iframe;
			if(!iframe){return;}
			var iframeWin = iframe.get(0).contentWindow;
			if(!iframeWin){return;}
			var iframeDoc = iframeWin.document;

			if(evt.type === 'tap'){
				var x = model.get('pointerX');
				var y = model.get('pointerY');
				var node = iframeDoc.elementFromPoint(x, y);
				$(node).trigger('tap');
			}else if(evt.type === 'touchstart'){
				this.dragStartPos = evt.y;
				this.startScrollPos = iframeWin.scrollY;
			}else if(evt.type === 'touchmove'){
				if(this.dragStartPos){
					var deltaPos = this.dragStartPos - evt.y;
					this.startScrollPos = this.startScrollPos || 0;
					iframeWin.scrollTo(0, this.startScrollPos + deltaPos);
				}
			}else if(evt.type === 'touchend'){
				this.dragStartPos = null;
				this.startScrollPos = iframeWin.scrollY;
			}
		},
		loadPage : function(){
			if(!this.iframe){
				this.iframe = $('<iframe></iframe>').appendTo(this.role('box'));
				this.iframe.css({
					'position' : 'absolute',
					'width' : this.model.get('width') + 'px',
					'height' : this.model.get('height') + 'px',
					'overflow' : 'hidden',
					'border' : 'none'
				}).attr('src', URL);
			}
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
		}
	});

	module.exports = Browser;

});