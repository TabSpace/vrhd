/**
 * @fileoverview 弧度转角度
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 * @param {Nmber} arc 弧度数值
 * @return {Number} 角度数值
 * @example

 */
define('lib/kit/math/arcToDeg',function(require,exports,module){

	module.exports = function(arc){
		return arc * 180 / Math.PI;
	};
});

