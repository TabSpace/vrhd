/**
 * @fileoverview 表面背景基类
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 表面背景基类定义表面背景的基本属性
 */
define('mods/view/surface/base',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $baseModel = require('mods/model/surface/base');

	var TPL = $tpl({
		box : '<div></div>'
	});

	var Base = $view.extend({
		defaults : {
			template : TPL.box,
			parent : null
		},
		build : function(){
			this.getModel();
			this.insert();
			this.setSize();
			this.setStyles();
		},
		setEvents : function(action){
			var proxy = this.proxy();
			this.delegate(action);
		},
		getModel : function(){
			this.model = new $baseModel();
		},
		insert : function(){
			this.role('root').appendTo(this.conf.parent);
		},
		setSize : function(){
			var parent = this.conf.parent;
			this.role('root').css({
				'position' : 'absolute',
				'width' : '100%',
				'height' : '100%'
			});
		},
		setStyles : function(){
			//设置样式
		},
		update : function(data){
			this.model.set(data);
		},
		toJSON : function(){
			var data = this.model.get();
			return data;
		}
	});

	module.exports = Base;

});
