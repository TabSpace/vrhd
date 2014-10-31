/**
 * @fileoverview 墙面
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间会有多个墙面，墙面的显示由多个层完成
 */
define('mods/view/wall',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');
	var $plane = require('mods/view/plane');
	var $wallModel = require('mods/model/wall');

	var TPL = $tpl({
		box : '<div></div>'
	});

	var Wall = $plane.extend({
		defaults : {
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
				type : conf.type,
				distance : conf.distance,
				width : conf.width,
				height : conf.height
			});
		},
		setPos : function(){
			//墙面的位置基于方向计算
			var model = this.model;
			var root = this.role('root');
			var type = model.get('type');
			root.attr('name', type);

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
			}else{
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
			surface.load('animate');
		}
	});

	module.exports = Wall;

});



