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
		box : '<div class="surface"></div>'
	});

	var Base = $view.extend({
		defaults : {
			name : 'name',
			path : '',
			//环境对象
			env : null,
			template : TPL.box,
			parent : null
		},
		build : function(){
			var conf = this.conf;
			this.path = [conf.path, conf.name].join('.');
			this.env = conf.env;
			this.parent = conf.parent;
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
			this.model = new $baseModel({});
		},
		insert : function(){
			var parent = this.conf.parent;
			this.role('root').appendTo(parent.role('root'));
		},
		setSize : function(){
			//设置大小
		},
		setStyles : function(){
			var root = this.role('root');
			var parentModel = this.parent.model;
			root.css({
				'width' : parentModel.get('width') + 'px',
				'height' : parentModel.get('height') + 'px'
			});
		},
		show : function(){
			this.role('root').show();
		},
		hide : function(){
			this.role('root').hide();
		},
		fxIn : function(){
			var root = this.role('root');
			root.show().css({
				'opacity' : 0
			}).transit({
				'opacity' : 1
			}, 1000, 'ease');
		},
		fxOut : function(){
			var root = this.role('root');
			root.css({
				'opacity' : 1
			}).transit({
				'opacity' : 0
			}, 1000, 'ease', function(){
				root.hide();
			});
		},
		fold : function(){
			var root = this.role('root');
			root.css({
				'position' : 'absolute',
				'left' : '50%',
				'top' : '50%',
				'border-radius' : 0,
				'overflow' : 'hidden'
			}).transform({
				'translateX' : '-50%',
				'translateY' : '-50%'
			}).transit({
				'width' : '200px',
				'height' : '200px',
				'border-radius' : '50%'
			}, 1000, 'ease');
		},
		unfold : function(){
			var root = this.role('root');
			var plane = this.conf.parent;
			root.transit({
				'width' : plane.model.get('width') + 'px',
				'height' : plane.model.get('height') + 'px',
				'border-radius' : 0
			}, 1000, 'ease');
		},
		update : function(data){
			this.model.set(data);
		},
		toJSON : function(){
			return this.model.get();
		}
	});

	module.exports = Base;

});
