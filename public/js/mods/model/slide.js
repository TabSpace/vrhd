/**
 * @fileoverview 墙面幻灯片
 * @authors
	Qiangyee <wjh_9527@163.com>
 * @description 墙面幻灯片数据模型
 */
define('mods/model/slide',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var pics = [
		'',
		'/images/floor/floor1.jpg',
		'/images/wall/wall1.jpg',
		'/images/wall/wall2.jpg',
		'/images/wall/wall3.jpg',
		'/images/wall/wall4.jpg',
		'/images/wall/wall5.jpg',
		'/images/wall/wall6.jpg',
		'/images/wall/wall7.jpg',
		'/images/wall/wall8.jpg',
		'/images/wall/wall9.jpg',
		'/images/wall/wall10.jpg',
		'/images/wall/wall11.jpg',
		'/images/wall/wall12.jpg'
	];

	var Slide = $model.extend({
		defaults : {
			plane : '',
			currentPic: 0
		},
		build : function(){
			this.pics = pics;
		}
	});

	module.exports = new Slide();

});
