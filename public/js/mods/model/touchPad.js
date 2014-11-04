/**
 * @fileoverview 触控板模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 提供场景唯一的模型，用于各个平面计算照射点
 */
define('mods/model/touchPad',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var TouchPad = $model.extend({
		defaults : {
			'eyeHeight' : 0,
			'alpha' : 0,
			'beta' : 0,
			'gamma' : 0
		},
		events : {

		},
		build : function(){

		}
	});

	module.exports = new TouchPad();

});

