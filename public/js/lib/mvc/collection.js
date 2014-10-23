/**
 * @fileoverview 基本集合
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 * @events
 *	change
 *	change:single
 *	change:all
 *	change:insert
 *	change:remove
 */
define('lib/mvc/collection',function(require,exports,module){
	var $ = require('lib');
	var $base = require('lib/mvc/base');
	var $delegate = require('lib/mvc/delegate');
	var $contains = require('lib/kit/arr/contains');
	var $flatten = require('lib/kit/arr/flatten');

	var $arr = {};
	$arr.erase = require('lib/kit/arr/erase');
	$arr.include = require('lib/kit/arr/include');

	var changed = function(type, index, item){
		if(type){
			if($.type(index) === 'number' && index >= 0){
				this.trigger('change:' + type, index, item);
			}else if($.type(index) === 'array'){
				this.trigger('change:' + type, index, item);
			}else{
				this.trigger('change:' + type);
			}
		}
		this.trigger('change');
	};

	//同步数组的长度
	var watchLength = function(){
		var that = this;
		var data = this.data;
		Object.defineProperty(this, 'length', {
			set : function(length){
				if(length !== data.length){
					data.length = length;
					changed.call(that, 'all');
				}
			},
			get : function(){
				return data.length;
			},
			enumerable:true,
			configurable:true
		});
	};

	var isIndex = function(index){
		return (
			$.type(index) === 'number' &&
			index >= 0 &&
			parseInt(index, 10) === index
		);
	};

	var AP = Array.prototype;

	var Collection = $base.extend({
		defaults : {},
		events : {},
		initialize : function(options){
			this.data = [];
			watchLength.call(this);
			Collection.superclass.initialize.apply(this,arguments);
		},
		//操作内部关联属性时，小心循环调用
		setEvents : function(action){
			this.delegate(action);
		},
		//代理自身事件
		delegate : function(action, root, events, bind){
			action = action || 'on';
			root = root || this;
			events = events || this.events;
			bind = bind || this;
			$delegate(action, root, events, bind);
		},
		//设置集合确定位置的元素
		//将会触发change事件
		set : function(index, item){
			var data = this.data;
			if(isIndex(index)){
				if(
					(item !== data[index]) ||
					($.type(item) === 'undefined' && !data.hasOwnProperty(index))
				){
					data[index] = item;
					changed.call(this, 'single', index, item);
				}
			}else if($.isArray(index)){
				data.length = 0;
				AP.splice.apply(data, [0,0].concat(index));
				changed.call(this, 'all');
			}
			return this;
		},
		//获取集合确定位置的值的拷贝
		//如果不传参数，则直接获取整个集合数据
		get : function(index){
			var item;
			var data = this.data;
			if(isIndex(index)){
				item = data[index];
				if($.isPlainObject(item)){
					return $.extend(true, {}, item);
				}else if($.isArray(item)){
					return $.extend(true, [], item);
				}else{
					return item;
				}
			}else if(typeof index === 'undefined'){
				if(data === undefined || data === null){
					return data;
				}else{
					return data.slice(0);
				}
			}
		},
		//清除集合中所有数据
		clear : function(){
			var data = this.data;
			if(data.length !== 0){
				data.length = 0;
				changed.call(this, 'all');
			}
			return this;
		},
		contains : function(item){
			return $contains(this.data, item);
		},
		destroy : function(){
			Collection.superclass.destroy.apply(this,arguments);
			this.clear();
			this.data = null;
		}
	});

	var ArrMethods = {};

	//下面这些方法会直接操作数组本身，集合直接沿用其功能，并触发change事件
	//不再返回原数组方法的返回值，而是返回集合本身
	var kits = ['erase', 'include'];

	['pop', 'push', 'shift', 'unshift'].concat(kits).forEach(function(method){
		ArrMethods[method] = function(){
			var data = this.data;
			var length = this.length;
			var args = AP.slice.call(arguments);
			var item = args[0];
			var index = 0;
			var result;
			if($contains(kits, method)){
				args.unshift(data);
				result = $arr[method].apply(null, args);
			}else{
				result = AP[method].apply(data, args);
			}

			var mpos = 0;
			if(length !==  this.length){
				mpos = ['unshift', 'push', 'include'].indexOf(method);
				if(mpos >= 0){
					index = mpos ? length : 0;
					changed.call(this, 'insert', index, item);
				}else{
					index = method === 'erase' ? result :
						method === 'pop' ? length - 1 : 0;
					changed.call(this, 'remove', index, 1);
				}
			}
			return this;
		};
	});

	['reverse', 'sort', 'splice'].forEach(function(method){
		ArrMethods[method] = function(){
			var data = this.data;
			AP[method].apply(data, arguments);
			changed.call(this, 'all');
			return this;
		};
	});

	//在指定位置插入若干元素
	//param {Number} index 指定的位置
	//param {Array} items 要插入的元素
	ArrMethods.insert = function(index, items){
		var data = this.data;
		var length = data.length;
		if(isIndex(index)){
			AP.splice.apply(data, [index, 0].concat(items));
			if(data.length !== length){
				changed.call(this, 'insert', index, items);
			}
		}
		return this;
	};

	//从指定位置移除若干元素
	//param {Number} index 指定的位置
	//param {Number} amount 要移除元素的数量
	ArrMethods.remove = function(index, amount){
		var data = this.data;
		var length = data.length;
		if(isIndex(index)){
			AP.splice.apply(data, [index, amount]);
			if(data.length !== length){
				changed.call(this, 'remove', index, amount);
			}
		}
		return this;
	};

	//这些方法本来是生成一个新的数组，集合则表现为修改自身，并触发change事件
	//如果不想修改自身，需要调用get方法取得集合数据再进行操作
	//不再返回原数组方法的返回值，而是返回集合本身
	['concat', 'map'].forEach(function(method){
		ArrMethods[method] = function(){
			var data = this.data;
			var args = AP.slice.call(arguments);
			var results = AP[method].apply(data, arguments);
			var length = this.length;
			data.length = 0;
			AP.splice.apply(data, [0,0].concat(results));
			if(method === 'map'){
				changed.call(this, 'all');
			}else if(length !==  this.length){
				changed.call(this, 'insert', length, $flatten(args));
			}
			return this;
		};
	});

	//filter方法将会收集被过滤元素所在的位置
	ArrMethods.filter = function(fn, context){
		var data = this.data;
		var positions = [];
		var result = [];
		var val;
		var items = [];

		for (var i = 0, len = data.length >>> 0; i < len; i++) {
			if (i in data) {
				val = data[i];
				// in case fn mutates this
				if (fn.call(context, val, i, data)) {
					result.push(val);
				}else{
					positions.push(i);
					items.push(val);
				}
			}
		}

		var length = this.length;
		data.length = 0;
		AP.splice.apply(data, [0,0].concat(result));
		if(length !==  this.length){
			changed.call(this, 'remove', positions, items);
		}
		return this;
	};

	//这些方法不操作数组本身，沿用原本的功能
	[
		'join', 'slice', 'indexOf', 'lastIndexOf', 'forEach',
		'every', 'some', 'reduce', 'reduceRight'
	].forEach(function(method){
		ArrMethods[method] = function(){
			var result = AP[method].apply(this.data, arguments);
			if(method === 'forEach'){
				return this;
			}else{
				return result;
			}
		};
	});

	Collection.implement(ArrMethods);

	module.exports = Collection;

});

