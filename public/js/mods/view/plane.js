/**
 * @fileoverview 平面
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 天花板，墙，地面都是平面，每个平面自己独立形成坐标系
 */
define('mods/view/plane',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $planeModel = require('mods/model/plane');
	var $surface = require('mods/ctrl/surface');

	var TPL = $tpl({
		box : '<div></div>'
	});

	var Plane = $view.extend({
		defaults : {
			//地面
			ground : null,
			width : 0,
			height : 0,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.ground = conf.ground;
			this.getModel();
			this.getSurface();
			this.create();
			this.setSize();
			this.setPos();
			this.setStyle();
			this.buildSurface();
		},
		setEvents : function(action){
			var model = this.model;
			var proxy = this.proxy();
			this.delegate(action);
			model.on('change:width', proxy('setSize'));
			model.on('change:height', proxy('setSize'));
		},
		getModel : function(){
			var conf = this.conf;
			this.model = new $planeModel({
				width : conf.width,
				height : conf.height
			});
		},
		getSurface : function(){
			this.surface = new $surface({
				parent : this.role('root')
			});
		},
		create : function(){
			this.role('root').appendTo(this.ground);
		},
		setSize : function(){
			var model = this.model;
			var root = this.role('root');
			var width = model.get('width');
			var height = model.get('height');
			root.css({
				'position' : 'absolute',
				'top' : '50%',
				'left' : '50%',
				'width' : width + 'px',
				'height' : height + 'px',
				'margin-left' : 0 - width / 2 + 'px',
				'margin-top' : 0 - height / 2 + 'px'
			});
		},
		setPos : function(){
			//一个房间的所有平面都是基于地面的坐标系设置位置的
		},
		setStyle : function(){
			var root = this.role('root');
			root.css({
				'backface-visibility' : 'hidden',
				'transform-style' : 'preserve-3d',
				'transform-origin' : '50% 50%'
			});
		},
		buildSurface : function(){
			//每个面由多个层组成，调整构建的顺序，可修改层叠的顺序
			var surface = this.surface;
			surface.load('background');
			surface.load('light');
			surface.load('animate');
		},
		update : function(data){
			data = data || {};
			this.surface.update(data.surface);
		},
		toJSON : function(){
			var data = {};
			data.surface = this.surface.toJSON();
			return data;
		}
	});

	module.exports = Plane;

});
