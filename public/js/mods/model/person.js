/**
 * @fileoverview 人物模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 人物的数据模型，存储人物信息相关的数据
 * @info
	高度数据参考：
	架设人身高1.75米
	1.1 相当于人坐着时眼睛离地面的距离，也相当于人站立时手拿激光笔距离地面的距离
	1.6 相当于人站着时眼睛离地面的距离
	0.7 相当于人坐着时手拿的激光笔距离地面的距离

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
			posture : 'standing',
			//触控板离地面的高度，单位为米
			padHeight : 0.7,
			//眼睛离地面的高度，单位为米
			eyeHeight : 1.1,
			//人在房间地面的坐标
			groundX : 0,
			groundY : 0
		},
		events : {
			'posture:change' : 'checkPosture'
		},
		build : function(){
			this.checkPosture();
		},
		checkPosture : function(){
			var posture = this.get('posture');
			if(posture === 'standing'){
				this.set({
					padHeight : 1.1,
					eyeHeight : 1.6
				});
			}else{
				this.set({
					padHeight : 0.7,
					eyeHeight : 1.1
				});
			}
		},
		toJSON : function(){
			return this.get();
		}
	});

	module.exports = Person;

});





