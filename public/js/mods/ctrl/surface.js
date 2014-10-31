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
			parent : null
		},
		build : function(){
			this.children = {};
		},
		get : function(name){
			var children = this.children;
			if(children[name]){
				return children[name];
			}
		},
		load : function(name, options, callback){
			var conf = this.conf;
			var that = this;
			lithe.use('mods/view/surface/' + name, function(ChildSurface){
				options = options || {};
				options.parent = conf.parent;
				var surface = new ChildSurface(options);
				that.children[name] = surface;
				if($.type(callback) === 'function'){
					callback();
				}
			});
		},
		update : function(data){
			var that = this;
			var children = this.children;
			data = data || {};
			$.each(data, function(name, options){
				if(children[name] && children[name].update){
					children[name].update(options);
				}else{
					that.load(name, options, function(){
						if(children[name] && children[name].update){
							children[name].update(options);
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
