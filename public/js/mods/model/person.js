/**
 * @fileoverview 人物模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 人物的数据模型，存储人物信息相关的数据
 */
define('mods/model/person',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var Person = $model.extend({
		defaults : {
			//设备旋转方向，也相当于提供了人眼的视觉方向
			alpha : 0,
			beta : 0,
			gamma : 0,
			//眼睛在空间中的高度，单位为米
			eyeHeight : 1.7,
			//人在房间地面的坐标
			groundX : 0,
			groundY : 0
		},
		events : {

		},
		build : function(){

		},
		toJSON : function(){
			return this.get();
		}
	});

	module.exports = Person;

});





