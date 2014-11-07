/**
 * @fileoverview 地板
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间有一个地板
 */
define('mods/view/floor',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');
	var $arcToDeg = require('lib/kit/math/arcToDeg');
	var $degToArc = require('lib/kit/math/degToArc');

	var $plane = require('mods/view/plane');
	var $floorModel = require('mods/model/floor');
	var $touchPadModel = require('mods/model/touchPad');

	var TPL = $tpl({
		box : '<div class="plane"></div>'
	});

	var Floor = $plane.extend({
		defaults : {
			name : 'floor',
			path : '',
			//地面
			ground : null,
			width : 0,
			height : 0,
			template : TPL.box
		},
		getModel : function(){
			var conf = this.conf;
			this.model = new $floorModel({
				name : conf.name,
				width : conf.width,
				height : conf.height
			});
		},
		setPos : function(){
			//地面的位置无需变更
			var root = this.role('root');
			root.attr('name', 'floor');
		},
		buildSurface : function(){
			var surface = this.surface;
			surface.load('background');
			surface.load('light');
			surface.load('animate');
		},
		//获取垂线长度
		getVerticalDistance : function(){
			return $touchPadModel.get('padHeight');
		},
		//获取指向平面的极限角度关键点
		getLimitDeg : function(){
			var model = this.model;
			var width = model.get('width');
			var height = model.get('height');
			var verticalDistance = this.getVerticalDistance();
			var limits = {};
			limits.alphaMin = -180;
			limits.alphaMax = 180;
			limits.betaMax = $arcToDeg(Math.atan(Math.max(width, height) / verticalDistance));
			limits.betaMin = 0;
			return limits;
		},
		//获取指向平面的差额角度
		getDeltaDeg : function(){
			var angle = $touchPadModel.get();
			var alpha = angle.alpha;
			var beta = 90 - Math.abs(angle.beta);
			alpha = alpha > 180 ? alpha - 360 : alpha;
			alpha = alpha < -180 ? 360 + alpha : alpha;
			angle.alpha = alpha;
			angle.beta = beta;
			return angle;
		},
		//获取触控板指在平面上的位置
		getPadPointPos : function(){
			var angle = this.getDeltaDeg();
			var center = this.getVerticalPos();
			var pos = {x : 0, y : 0};
			var verticalDistance = this.getVerticalDistance();
			pos.x = center.x - verticalDistance * Math.tan($degToArc(angle.beta)) * Math.sin($degToArc(angle.alpha));
			pos.y = center.y - verticalDistance * Math.tan($degToArc(angle.beta)) * Math.cos($degToArc(angle.alpha));
			return pos;
		},
		//获取顶点坐标
		getVertex : function(){
			var data = {};
			var model = this.model;
			var width = model.get('width');
			var height = model.get('height');
			var padHeight = $touchPadModel.get('padHeight');
			data.leftTop = [- width / 2, - height / 2, - padHeight];
			data.rightTop = [width / 2, - height / 2, - padHeight];
			data.rightBottom = [width / 2, height / 2, - padHeight];
			data.leftBottom = [- width / 2, height / 2, - padHeight];
			return data;
		}
	});

	module.exports = Floor;

});



