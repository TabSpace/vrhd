/**
 * @fileoverview 墙面幻灯片
 * @authors
 	Qiangyee <wjh_9527@163.com>
 * @description 墙面幻灯片数据模型
 */
define('mods/model/slide',function(require,exports,module){

	var $ = require('lib');
	var $plane = require('mods/model/plane');

	var Slide = $plane.extend({
		defaults : {
			pics: ['/images/slide/1.jpg','/images/slide/2.jpg','/images/slide/3.jpg','/images/slide/4.jpg','/images/slide/5.jpg']
		}
	});

	module.exports = Slide;

});
