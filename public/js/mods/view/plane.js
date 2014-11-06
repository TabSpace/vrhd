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
	var $pointerModel = require('mods/model/pointer');
	var $touchPadModel = require('mods/model/touchPad');

	var TPL = $tpl({
		box : '<div class="plane"></div>'
	});

	var Plane = $view.extend({
		defaults : {
			name : 'plane',
			path : '',
			//地面
			ground : null,
			width : 0,
			height : 0,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.path = [conf.path, conf.name].join('.');
			this.ground = conf.ground;
			this.getModel();
			this.getPointerModel();
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
			$touchPadModel.on('change', proxy('updatePointer'));
		},
		getModel : function(){
			var conf = this.conf;
			this.model = new $planeModel({
				width : conf.width,
				height : conf.height
			});
		},
		//获取指针模型
		getPointerModel : function(){
			this.pointerModel = new $pointerModel({
				bePointed : true,
				x : 0,
				y : 0
			});
		},
		getSurface : function(){
			this.surface = new $surface({
				path : this.path,
				parent : this
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
			//设置平面的样式
		},
		//判断该平面是否被触控板指向
		bePointedTo : function(){
			return true;
		},
		//触控板指在平面上的位置
		getPadPointPos : function(){
			var data = $touchPadModel.get();
			var center = this.getVerticalPos();
			var pos = {x : 0, y : 0};
			var verticalDistance = this.getVerticalDistance();
			pos.x = Math.tan(Math.PI * data.alpha / 180) * verticalDistance;
			pos.y = Math.tan(Math.PI * data.beta / 180) * verticalDistance;
			return pos;
		},
		//获取中心点到墙面的垂线与面相交的位置
		getVerticalPos : function(){
			var model = this.model;
			return {
				x : model.get('width') / 2,
				y : model.get('height') / 2
			};
		},
		//获取垂线长度
		getVerticalDistance : function(){
			return this.model.get('distance');
		},
		//更新指针状态
		updatePointer : function(){
			var pointerModel = this.pointerModel;
			var bePointed = this.bePointedTo();
			var pos = {x : 0, y : 0};

			if(bePointed){
				pos = this.getPadPointPos();
			}

			pointerModel.set({
				bePointed : bePointed,
				x : pos.x,
				y : pos.y
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
