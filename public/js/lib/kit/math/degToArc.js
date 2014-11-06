/**
 * @fileoverview 角度转弧度
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 * @param {Nmber} deg 角度数值
 * @return {Number} 弧度数值
 * @example
	var $degToArc = require('lib/kit/math/degToArc');
	Math.sin($degToArc(30));	//0.5
 */
define('lib/kit/math/degToArc',function(require,exports,module){

	module.exports = function(deg){
		return Math.PI * deg / 180;
	};
});

