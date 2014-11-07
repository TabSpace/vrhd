/**
 * @fileoverview 天花板
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间有一个天花板
 */
define('mods/view/ceiling',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');
	var $arcToDeg = require('lib/kit/math/arcToDeg');
	var $degToArc = require('lib/kit/math/degToArc');

	var $plane = require('mods/view/plane');
	var $ceilingModel = require('mods/model/ceiling');
	var $touchPadModel = require('mods/model/touchPad');

	var TPL = $tpl({
		box : '<div class="plane"></div>'
	});

	var Ceiling = $plane.extend({
		defaults : {
			name : 'ceiling',
			path : '',
			//地面
			ground : null,
			width : 0,
			height : 0,
			distance : 0,
			template : TPL.box
		},
		getModel : function(){
			var conf = this.conf;
			this.model = new $ceilingModel({
				name : conf.name,
				width : conf.width,
				height : conf.height,
				distance : conf.distance
			});
		},
		setPos : function(){
			//天花板的位置基于房高计算
			var root = this.role('root');
			root.attr('name', 'ceiling');

			var model = this.model;
			root.transform({
				'translateZ' : model.get('distance') - 1 + 'px',
				'rotateX' : '180deg'
			});
		},
		buildSurface : function(){
			var surface = this.surface;
			surface.load('background');
			surface.load('light');
			surface.load('animate');
		},
		getVerticalDistance : function(){
			var distance = this.model.get('distance');
			return distance - $touchPadModel.get('padHeight');
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
			limits.betaMax = 90;
			limits.betaMin = 90 - $arcToDeg(Math.atan(Math.max(width, height) / verticalDistance));
			return limits;
		},
		//获取指向平面的差额角度
		getDeltaDeg : function(){
			var angle = $touchPadModel.get();
			var alpha = angle.alpha;
			alpha = alpha > 180 ? alpha - 360 : alpha;
			alpha = alpha < -180 ? 360 + alpha : alpha;
			angle.alpha = alpha;
			return angle;
		},
		//获取触控板指在平面上的位置
		getPadPointPos : function(){
			var angle = this.getDeltaDeg();
			var center = this.getVerticalPos();
			var beta = 90 - Math.abs(angle.beta);
			var pos = {x : 0, y : 0};
			var verticalDistance = this.getVerticalDistance();
			pos.x = center.x - verticalDistance * Math.tan($degToArc(beta)) * Math.sin($degToArc(angle.alpha));
			pos.y = center.y + verticalDistance * Math.tan($degToArc(beta)) * Math.cos($degToArc(angle.alpha));
			return pos;
		},
		//获取顶点坐标
		getVertex : function(){
			var data = {};
			var model = this.model;
			var width = model.get('width');
			var height = model.get('height');
			var distance = model.get('distance');
			var padHeight = $touchPadModel.get('padHeight');
			data.leftTop = [- width / 2, - height / 2, distance - padHeight];
			data.rightTop = [width / 2, - height / 2, distance - padHeight];
			data.rightBottom = [width / 2, height / 2, distance - padHeight];
			data.leftBottom = [- width / 2, height / 2, distance - padHeight];
			return data;
		}
	});

	module.exports = Ceiling;

});


