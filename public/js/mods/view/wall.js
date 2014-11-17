/**
 * @fileoverview 墙面
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间会有多个墙面，墙面的显示由多个层完成
 */
define('mods/view/wall',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');
	var $arcToDeg = require('lib/kit/math/arcToDeg');
	var $degToArc = require('lib/kit/math/degToArc');

	var $plane = require('mods/view/plane');
	var $wallModel = require('mods/model/wall');
	var $touchPadModel = require('mods/model/touchPad');
	var $channel = require('lib/common/channel');
	var $desktop = require('mods/view/desktop');

	var TPL = $tpl({
		box : '<div class="plane"></div>'
	});

	var Wall = $plane.extend({
		defaults : {
			name : 'wall',
			path : '',
			//地面
			ground : null,
			width : 0,
			height : 0,
			distance : 0,
			type : 'front',
			template : TPL.box
		},
		getModel : function(){
			var conf = this.conf;
			this.model = new $wallModel({
				name : conf.name,
				type : conf.type,
				distance : conf.distance,
				width : conf.width,
				height : conf.height
			});
			this.getVertex();
		},
		setEvents : function(){
			Wall.superclass.setEvents.apply(this,arguments);
			var proxy = this.proxy();
			$channel.on('on-tv-tap', proxy('showDesktop'));
		},
		setPos : function(){
			//墙面的位置基于方向计算
			var conf = this.conf;
			var model = this.model;
			var root = this.role('root');
			var type = model.get('type');
			root.attr('name', conf.name);

			var width = model.get('width');
			var height = model.get('height');
			var distance = model.get('distance');
			distance = distance - 1;

			if(type === 'left'){
				root.transform({
					'rotateX' : '-90deg',
					'rotateY' : '90deg',
					'translateY' : 0 - height / 2 + 'px',
					'translateZ' : 0 - distance + 'px'
				});
			}else if(type === 'right'){
				root.transform({
					'rotateX' : '-90deg',
					'rotateY' : '-90deg',
					'translateY' : 0 - height / 2 + 'px',
					'translateZ' : 0 - distance + 'px'
				});
			}else if(type === 'behind'){
				root.transform({
					'rotateX' : '-90deg',
					'rotateY' : '180deg',
					'translateY' : 0 - height / 2 + 'px',
					'translateZ' : 0 - distance + 'px'
				});
			}else if(type === 'front'){
				root.transform({
					'rotateX' : '-90deg',
					'translateY' : 0 - height / 2 + 'px',
					'translateZ' : 0 - distance + 'px'
				});
			}
		},
		buildSurface : function(){
			var surface = this.surface;
			surface.load('background');
			surface.load('light');
			surface.load('mask');
			surface.load('content');
			surface.load('animate');
		},
		//获取指向平面的极限角度关键点
		getLimitDeg : function(){
			var model = this.model;
			var width = model.get('width');
			var height = model.get('height');
			var verticalDistance = this.getVerticalDistance();
			var padHeight = $touchPadModel.get('padHeight');
			var limits = {};
			limits.alphaMin = $arcToDeg( Math.atan((- width / 2) / verticalDistance) );
			limits.alphaMax = $arcToDeg( Math.atan((width / 2) / verticalDistance) );
			limits.betaMin = $arcToDeg( Math.atan(- padHeight / verticalDistance) );
			limits.betaMax = $arcToDeg( Math.atan((height - padHeight) / verticalDistance) );
			return limits;
		},
		//从原点到面做垂线，求垂线的角度
		getVerticalDeg : function(){
			var model = this.model;
			var type = model.get('type');
			var angle = {};
			if(type === 'left'){
				angle.alpha = 90;
				angle.beta = 0;
			}else if(type === 'right'){
				angle.alpha = 270;
				angle.beta = 0;
			}else if(type === 'behind'){
				angle.alpha = 180;
				angle.beta = 0;
			}else if(type === 'front'){
				angle.alpha = 0;
				angle.beta = 0;
			}
			return angle;
		},
		//获取指向平面的差额角度
		getDeltaDeg : function(){
			var angle = $touchPadModel.get();
			var verticalDeg = this.getVerticalDeg();
			var alpha = angle.alpha - verticalDeg.alpha;
			alpha = alpha > 180 ? alpha - 360 : alpha;
			alpha = alpha < -180 ? 360 + alpha : alpha;
			angle.alpha = alpha;
			return angle;
		},
		//获取中心点到墙面的垂线与面相交的位置
		getVerticalPos : function(){
			var padHeight = $touchPadModel.get('padHeight');
			var model = this.model;
			return {
				x : model.get('width') / 2,
				y : model.get('height') - padHeight
			};
		},
		//显示系统桌面
		showDesktop : function(){
			if(!this.desktop){
				var mask = this.surface.get('mask');
				if(mask && mask.tv){
					this.desktop = new $desktop({
						tv : mask.tv,
						plane : this
					});
				}
			}
			if(this.desktop){
				this.desktop.show();
			}
		},
		//获取顶点坐标，该坐标相对于遥控器的位置
		getVertex : function(){
			var data = {};
			var model = this.model;
			var type = model.get('type');
			var width = model.get('width');
			var height = model.get('height');
			var distance = model.get('distance');
			var padHeight = $touchPadModel.get('padHeight');

			if(type === 'left'){
				data.leftTop = [- distance, width / 2, height - padHeight];
				data.rightTop = [- distance, - width / 2, height - padHeight];
				data.rightBottom = [- distance, - width / 2, - padHeight];
				data.leftBottom = [- distance, width / 2, - padHeight];
			}else if(type === 'right'){
				data.leftTop = [distance, - width / 2, height - padHeight];
				data.rightTop = [distance, width / 2, height - padHeight];
				data.rightBottom = [distance, width / 2, - padHeight];
				data.leftBottom = [distance, - width / 2, - padHeight];
			}else if(type === 'behind'){
				data.leftTop = [width / 2, distance, height - padHeight];
				data.rightTop = [- width / 2, distance, height - padHeight];
				data.rightBottom = [- width / 2, distance, - padHeight];
				data.leftBottom = [width / 2, distance, - padHeight];
			}else if(type === 'front'){
				data.leftTop = [- width / 2, - distance, height - padHeight];
				data.rightTop = [width / 2, - distance, height - padHeight];
				data.rightBottom = [width / 2, - distance, - padHeight];
				data.leftBottom = [- width / 2, - distance, - padHeight];
			}

			return data;
		}
	});

	module.exports = Wall;

});



