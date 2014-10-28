/**
 * @fileoverview 平面
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 天花板，墙，地面都是平面，每个平面自己独立形成坐标系
 */
define('mods/view/plane',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $planeModel = require('mods/model/plane');

	var TPL = $tpl({
		box : '<div></div>'
	});

	var Plane = $view.extend({
		defaults : {
			//地面
			ground : null,
			width : 0,
			height : 0,
			template : TPL.box
		},
		build : function(){

			var conf = this.conf;
			console.log(conf);
			this.ground = conf.ground;
			this.getModel();
			this.create();
			this.setSize();
			this.setPos();
			this.buildSurface();
		},
		setEvents : function(action){
			var model = this.model;
			var proxy = this.proxy();
			this.delegate(action);
			model.on('change:width', proxy('setSize'));
			model.on('change:height', proxy('setSize'));
		},
		getModel : function(){
			var conf = this.conf;
			this.model = new $planeModel({
				width : conf.width,
				height : conf.height
			});
		},
		create : function(){
			this.role('root').appendTo(this.ground);
		},
		setSize : function(){
			var model = this.model;
			var root = this.role('root');
			root.css({
				width : model.get('width') + 'px',
				height : model.get('height') + 'px'
			});
		},
		setPos : function(){

		},
		buildSurface : function(){

		}
	});

	module.exports = Plane;

});
