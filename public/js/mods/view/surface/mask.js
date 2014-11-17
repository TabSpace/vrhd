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
			zIndex : 1,
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
			model.on('change:door', proxy('setDoor'));
			model.on('change:window', proxy('setWindow'));
			model.on('change:tv', proxy('setTV'));
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
		}
	});

	module.exports = Mask;

});
