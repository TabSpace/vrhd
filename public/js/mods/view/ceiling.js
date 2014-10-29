/**
 * @fileoverview 天花板
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间有一个天花板
 */
define('mods/view/ceiling',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');
	var $plane = require('mods/view/plane');
	var $ceilingModel = require('mods/model/ceiling');

	var TPL = $tpl({
		box : '<div></div>'
	});

	var Ceiling = $plane.extend({
		defaults : {
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
			
		}
	});

	module.exports = Ceiling;

});


