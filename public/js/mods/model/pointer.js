/**
 * @fileoverview 指针模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 记录触控板指向墙面的位置
 */
define('mods/model/pointer',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var Pointer = $model.extend({
		defaults : {
			x : 0,
			y : 0
		},
		events : {

		},
		build : function(){

		}
	});

	module.exports = Pointer;

});





