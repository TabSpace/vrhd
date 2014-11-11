/**
 * @fileoverview 层管理器
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个平面可以有多个层，层管理器用来加载所需层
 */
define('mods/ctrl/surface',function(require,exports,module){

	var $ = require('lib');
	var $controller = require('lib/mvc/controller');

	var Surface = $controller.extend({
		defaults : {
			name : 'surface',
			path : '',
			//环境对象
			env : '',
			parent : null
		},
		build : function(){
			var conf = this.conf;
			this.path = [conf.path, conf.name].join('.');
			this.env = conf.env;
			this.children = {};
		},
		get : function(name){
			var children = this.children;
			if(children[name]){
				return children[name];
			}
		},
		load : function(name, spec, callback){
			var conf = this.conf;
			var that = this;
			lithe.use('mods/view/surface/' + name, function(ChildSurface){
				var options = $.extend({}, spec, {
					path : that.path,
					env : that.env,
					parent : conf.parent
				});
				if(!that.children[name]){
					var surface = new ChildSurface(options);
					that.children[name] = surface;
				}
				if($.type(callback) === 'function'){
					callback();
				}
			});
		},
		update : function(data){
			var that = this;
			var children = this.children;
			data = data || {};
			$.each(data, function(name, item){
				if(children[name] && children[name].update){
					children[name].update(item);
				}else{
					that.load(name, item, function(){
						if(children[name] && children[name].update){
							//为了避免toJSON操作时获取到过量数据
							//更新数据时避免将parent这样的复杂对象传入
							children[name].update(item);
						}
					});
				}
			});
		},
		toJSON : function(){
			var data = {};
			$.each(this.children, function(name, obj){
				data[name] = obj.toJSON();
			});
			return data;
		}
	});

	module.exports = Surface;

});
