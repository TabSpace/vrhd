/**
 * @fileoverview 查找符合条件的元素在数组中的位置 
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 * @param {Array} arr 要操作的数组
 * @param {Function} fn 条件函数
 * @return {Array} 符合条件的元素在数组中的位置
 * @example
	var $find = require('lib/kit/util/find');
	console.debug($find([1,2,3,4,5],function(item){
		return item < 3;
	});	//[0, 1]
 */

define('lib/kit/arr/find',function(require,exports,module){

	module.exports = function(arr, fn, context){
		var positions = [];
		arr.forEach(function(item, index){
			if(fn.call(context, item, index, arr)){
				positions.push(index);
			}
		});
		return positions;
	};

});


