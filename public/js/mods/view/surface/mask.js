/**
 * @fileoverview 遮罩物
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 提供各种平面遮盖物，如门窗，电视机等
 */
define('mods/view/surface/mask',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/view/surface/base');
	var $tpl = require('lib/kit/util/template');
	var $maskModel = require('mods/model/surface/mask');
	var $socket = require('mods/channel/socket');
	var $channel = require('lib/common/channel');

	var $tv = require('mods/view/tv');

	var TPL = $tpl({
		'box' : '<div class="surface" name="mask"></div>',
		'door' : '<div class="mask" name="door"></div>',
		'window' : [
			'<div class="mask" name="window">',
				'<div class="inner"></div>',
				'<div class="outer"></div>',
			'</div>'
		]
	});

	var Mask = $base.extend({
		defaults : {
			name : 'mask',
			path : '',
			//环境对象
			env : null,
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $maskModel();
		},
		setEvents : function(){
			var proxy = this.proxy();
			var model = this.model;
			var plane = this.conf.parent;
			model.on('change:door', proxy('setDoor'));
			model.on('change:window', proxy('setWindow'));
			model.on('change:tv', proxy('setTV'));
			plane.pointerModel.on('change', proxy('checkHover'));
			plane.model.on('change:bePointed', proxy('checkHover'));
			$socket.on('touchpad:event', proxy('checkEvent'));
		},
		setStyles : function(){
			var root = this.role('root');
			var parentModel = this.parent.model;
			root.css({
				'overflow' : 'hidden',
				'width' : parentModel.get('width') + 'px',
				'height' : parentModel.get('height') + 'px'
			});
		},
		setDoor : function(){
			var model = this.model;
			var data = model.get('door');
			var root = this.role('root');
			var env = this.env;
			var ratio = env.getRatio();
			if(!data){return;}
			if(!this.door){
				this.door = $(TPL.get('door')).appendTo(root);
			}
			var plane = this.conf.parent;
			var planeHeight = plane.model.get('height');
			this.door.css({
				'position' : 'absolute',
				'bottom' : 0,
				'left' : data.left * ratio + 'px',
				'background-image' : 'url(' + data.style + ')',
				'background-size' : 'cover',
				'background-repeat' : 'no-repeat',
				'width' : data.width * ratio + 'px',
				'height' : data.height * ratio + 'px'
			});
			this.doorOffset = {
				'left' : data.left * ratio,
				'top' : planeHeight - data.height * ratio,
				'right' : data.left * ratio + data.width * ratio,
				'bottom' : planeHeight
			};
		},
		setWindow : function(){
			var model = this.model;
			var data = model.get('window');
			var root = this.role('root');
			var env = this.env;
			var ratio = env.getRatio();
			if(!data){return;}
			if(!this.win){
				this.win = {};
				this.win.box = $(TPL.get('window')).appendTo(root);
				this.win.outer = this.win.box.find('.outer');
				this.win.inner = this.win.box.find('.inner');
			}
			this.win.box.css({
				'position' : 'absolute',
				'overflow' : 'hidden',
				'top' : data.top * ratio + 'px',
				'left' : data.left * ratio + 'px',
				'width' : data.width * ratio + 'px',
				'height' : data.height * ratio + 'px'
			});
			this.win.inner.css({
				'position' : 'absolute',
				'top' :0,
				'left' : 0,
				'background-image' : 'url(' + data.outer + ')',
				'background-size' : 'cover',
				'background-repeat' : 'no-repeat',
				'width' : data.width * ratio + 'px',
				'height' : data.height * ratio + 'px'
			});
			this.win.outer.css({
				'position' : 'absolute',
				'top' :0,
				'left' : 0,
				'background-image' : 'url(' + data.style + ')',
				'background-size' : 'cover',
				'background-repeat' : 'no-repeat',
				'width' : data.width * ratio + 'px',
				'height' : data.height * ratio + 'px'
			});
		},
		setTV : function(){
			var model = this.model;
			var data = model.get('tv');
			var root = this.role('root');
			if(!data){return;}
			if(!this.tv){
				this.tv = new $tv($.extend({
					env : this.env,
					plane : this.conf.parent,
					parentNode : root
				}, data));
			}
			this.tv.update(data);
		},
		checkEvent : function(event){
			event = event || {};
			if(!event.type){return;}
			if(!this.door){return;}
			if(!this.door.attr('hover')){return;}
			if(event.type === 'tap'){
				$channel.trigger('back-to-room');
			}
		},
		checkHover : function(){
			if(!this.door){return;}
			if(!this.doorOffset){return;}
			var plane = this.conf.parent;
			var pos = plane.pointerModel.get();
			var coordinates = this.doorOffset;
			if(
				plane.model.get('bePointed') &&
				pos.x > coordinates.left &&
				pos.x < coordinates.right &&
				pos.y > coordinates.top &&
				pos.y < coordinates.bottom
			){
				this.door.css({
					'box-shadow' : 'rgba(255,255,255,0.5) 0 0 10px 10px'
				}).attr('hover', 'y');
			}else{
				this.door.css({
					'box-shadow' : 'none'
				}).attr('hover', '');
			}
		}
	});

	module.exports = Mask;

});
