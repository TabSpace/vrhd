/**
 * @fileoverview 坐标系模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 计算坐标系数据
 */
define('mods/model/coordinateSystem',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var CoordinateSystem = $model.extend({
		defaults : {
			alpha : 0,
			beta : 0,
			gamma : 0,
			transform : ''
		},
		events : {

		},
		build : function(){

		}
	});

	module.exports = CoordinateSystem;

});






