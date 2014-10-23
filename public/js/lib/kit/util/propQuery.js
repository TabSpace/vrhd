/**
 * @fileoverview 解析自定义属性值为一个对象，或者将一个hash对象解析为一个自定义属性值，以类似CSS的键值对方式。 
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 * @example
	var $propQuery = require('lib/kit/util/propQuery');

	//output 'a:1;b:2;c:3;'
	$propQuery.stringify({a:1, b:2, c:3});

	//output {a:'1', b:'2', c:'3'}
	$propQuery.parse('a:1;b:2;c:3');

	//output {a:'1',b:'http:path;extra'}
	$propQuery.parse('a:1;b:url(http:path;extra);c:;s$a#:adf;');
 */

define('lib/kit/util/propQuery',function(require,exports,module){

	var $ = require('lib');

	var propQuery = {};

	propQuery.parse = function(str){
		var obj = {};
		str = str || '';
		str = str + '';
		str = str.trim();
		//确保字符串末尾以分号结束
		if(str.charAt(str.length - 1) !== ';'){
			str = str + ';';
		}
		str.replace(/\s*(\w+)\s*\:\s*url\(([^\)]*)\)\s*\;/gi, function(p, key, val){
			//匹配key:url(http://path;extra);的情况
			//解析为key:'http://path;extra'
			obj[key] = val.trim();
			return '';
		}).replace(/\s*(\w+)\s*\:\s*([^;]+)\s*\;/gi, function(p, key, val){
			//匹配key:value;的情况
			//解析为key:'val'
			obj[key] = val.trim();
			return '';
		});
		return obj;
	};

	propQuery.stringify = function(object){
		var str = '';
		if($.isPlainObject(object)){
			str = Object.keys(object).map(function(key){
				return key + ':' + object[key] + ';';
			}).join('');
		}else{
			str = str + object;
		}
		return str;
	};

	module.exports = propQuery;

});

