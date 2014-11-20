/**
 * @fileoverview 平面
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 天花板，墙，地面都是平面，每个平面自己独立形成坐标系
 */
define('mods/view/plane',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');

	var $limit = require('lib/kit/num/limit');
	var $tpl = require('lib/kit/util/template');
	var $arcToDeg = require('lib/kit/math/arcToDeg');
	var $degToArc = require('lib/kit/math/degToArc');

	var $planeModel = require('mods/model/plane');
	var $surface = require('mods/ctrl/surface');
	var $pointerModel = require('mods/model/pointer');
	var $touchPadModel = require('mods/model/touchPad');
	var $socket = require('mods/channel/socket');
	var $channel = require('lib/common/channel');

	var TPL = $tpl({
		box : '<div class="plane"></div>'
	});

	var Plane = $view.extend({
		defaults : {
			name : 'plane',
			path : '',
			//环境对象
			env : null,
			//地面
			ground : null,
			width : 0,
			height : 0,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.path = [conf.path, conf.name].join('.');
			this.env = conf.env;
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
			var root = this.role('root');
			var model = this.model;
			var proxy = this.proxy();
			this.delegate(action);
			model.on('change', proxy('sync'));
			model.on('change:width', proxy('setSize'));
			model.on('change:height', proxy('setSize'));
			model.on('change:visible', proxy('checkVisible'));
			$touchPadModel.on('change', proxy('updatePointer'));
			root.on('mouseenter', proxy('onPointerEnter'));
			root.on('mouseleave', proxy('onPointerLeave'));
			$socket.on(this.path + ':sync', proxy('onSync'));
			root.on('click', proxy('toggleBgSelector'));
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
				x : 0,
				y : 0
			});
		},
		getSurface : function(){
			this.surface = new $surface({
				path : this.path,
				env : this.env,
				parent : this
			});
		},
		create : function(){
			this.role('root').appendTo(this.ground);
		},
		//同步数据模型
		sync : function(){
			$socket.trigger(this.path + ':sync', this.model.get());
		},
		//获取同步数据更新模型
		onSync : function(data){
			this.model.set(data);
		},
		onPointerEnter : function(){
			this.model.set('hover', true);
		},
		onPointerLeave : function(){
			this.model.set('hover', false);
		},
		//切换背景选择器的显示与隐藏
		toggleBgSelector : function(){
			var bgSelector = this.env.getBackgroundSelector();
			bgSelector.toggle(this);
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
			var angle = this.getDeltaDeg();
			var limits = this.getLimitDeg();
			if(
				angle.alpha > limits.alphaMin &&
				angle.alpha < limits.alphaMax &&
				angle.beta > limits.betaMin &&
				angle.beta < limits.betaMax
			){
				var model = this.model;
				var pos = this.getPadPointPos();
				var width = model.get('width');
				var height = model.get('height');
				return (
					pos.x > 0 &&
					pos.x < width &&
					pos.y > 0 &&
					pos.y < height
				);
			}else{
				return false;
			}
		},
		//获取指向平面的极限角度关键点
		getLimitDeg : function(){
			return {
				alphaMin : -180,
				alphaMax : 180,
				betaMin : -90,
				betaMax : 90
			};
		},
		//获取指向平面的差额角度
		getDeltaDeg : function(){
			return $touchPadModel.get();
		},
		//获取触控板指在平面上的位置
		getPadPointPos : function(){
			var angle = this.getDeltaDeg();
			var center = this.getVerticalPos();
			var pos = {x : 0, y : 0};
			var verticalDistance = this.getVerticalDistance();
			pos.x = center.x - verticalDistance * Math.tan($degToArc(angle.alpha));
			pos.y = center.y - verticalDistance * Math.tan($degToArc(angle.beta)) / Math.abs(Math.cos($degToArc(angle.alpha)));
			return pos;
		},
		//获取触控板指在可视平面上的位置，格式化位置避免超出范围
		getPointerPos : function(){
			var model = this.model;
			var pos = this.getPadPointPos();
			var width = model.get('width');
			var height = model.get('height');
			pos.x = $limit(pos.x, 0, width);
			pos.y = $limit(pos.y, 0, height);
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
			this.model.set('bePointed', bePointed);

			var pos = {x : 0, y : 0};
			if(bePointed){
				pos = this.getPointerPos();
				pointerModel.set({
					x : pos.x,
					y : pos.y
				});
			}
		},
		buildSurface : function(){
			//每个面由多个层组成，调整构建的顺序，可修改层叠的顺序
			var surface = this.surface;
			surface.load('background');
			surface.load('light');
			surface.load('mask');
			surface.load('content');
			surface.load('animate');
		},
		show : function(){
			console.log(this.conf.name, 'show');
			this.model.set('visible', true);
		},
		hide : function(){
			this.model.set('visible', false);
		},
		checkVisible : function(){
			if(this.model.get('visible')){
				this.fxIn();
			}else{
				this.fxOut();
			}
		},
		fxIn : function(){
			var root = this.role('root');
			var surface = this.surface;
			var mask = surface.get('mask');
			if(mask.door){
				setTimeout(function(){
					surface.get('background').fxIn();
					surface.get('light').fxIn();
				}, 1500);
			}else if(this.conf.name === 'floor'){
				surface.get('background').unfold();
				surface.get('light').unfold();
			}else{
				setTimeout(function(){
					root.show().css({
						'opacity' : 0
					}).transit({
						'opacity' : 1
					}, 1000, 'ease');
				}, 3000);
			}
		},
		fxOut : function(){
			var root = this.role('root');
			var surface = this.surface;
			var mask = surface.get('mask');
			if(mask.door){
				setTimeout(function(){
					surface.get('background').fxOut();
					surface.get('light').fxOut();
				}, 1500);
			}else if(this.conf.name === 'floor'){
				setTimeout(function(){
					surface.get('background').fold();
					surface.get('light').fold();
				}, 3000);
			}else{
				root.css({
					'opacity' : 1
				}).transit({
					'opacity' : 0
				}, 1000, 'ease', function(){
					root.hide();
				});
			}
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
