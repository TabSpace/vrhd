/**
 * @fileoverview 背景选择器模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 背景选择器模型
 */
define('mods/model/backgroundSelector',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var BackgroundSelector = $model.extend({
		defaults : {

		},
		events : {

		},
		build : function(){

		},
		toJSON : function(){
			return this.get();
		}
	});

	module.exports = BackgroundSelector;

});





