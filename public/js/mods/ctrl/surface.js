/**
 * @fileoverview 层管理器
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个平面可以有多个层，层管理器用来加载所需层
 */
define('mods/ctrl/surface',function(require,exports,module){

	var $ = require('lib');
	var $controller = require('lib/mvc/controller');
	
	var $background = require('mods/view/surface/background');
	var $light = require('mods/view/surface/light');
	var $mask = require('mods/view/surface/mask');
	var $content = require('mods/view/surface/content');
	var $animate = require('mods/view/surface/animate');

	var SURFACE_LIST = {
		'background' : $background,
		'light' : $light,
		'mask' : $mask,
		'content' : $content,
		'animate' : $animate
	};

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
		load : function(name, spec){
			if(this.children[name]){return;}
			var conf = this.conf;
			var ChildSurface = SURFACE_LIST[name];
			if(!ChildSurface){return;}

			var options = $.extend({}, spec, {
				path : this.path,
				env : this.env,
				parent : conf.parent
			});
			var surface = new ChildSurface(options);
			this.children[name] = surface;
		},
		update : function(data){
			var children = this.children;
			data = data || {};
			$.each(data, function(name, item){
				if(children[name] && children[name].update){
					children[name].update(item);
				}else{
					this.load(name, item);
					if(children[name] && children[name].update){
						//为了避免toJSON操作时获取到过量数据
						//更新数据时避免将parent这样的复杂对象传入
						children[name].update(item);
					}
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
