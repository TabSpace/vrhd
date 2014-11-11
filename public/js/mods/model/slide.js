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
			pics: null
		}
	});

	module.exports = Slide;

});
