/**
 * @fileoverview 地板
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间有一个地板
 */
define('mods/view/floor',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');
	var $plane = require('mods/view/plane');
	var $floorModel = require('mods/model/floor');

	var TPL = $tpl({
		box : '<div></div>'
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
		}
	});

	module.exports = Floor;

});



