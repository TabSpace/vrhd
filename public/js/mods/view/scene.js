/**
 * @fileoverview 场景视图
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 显示3D场景的界面
 */
define('mods/view/scene',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $sceneModel = require('mods/model/scene');
	var $CoordinateSystem = require('mods/view/coordinateSystem');
	var $House = require('mods/view/house');
	var $personModel = require('mods/model/person');

	var Scene = $view.extend({
		defaults : {
			name : 'scene',
			path : '',
			node : null,
			isSightDevice : true,
			type : 'front'
		},
		build : function(){
			var conf = this.conf;
			this.path = [conf.path, conf.name].join('.');
			this.model = new $sceneModel({
				type : conf.type
			});
			this.personModel = new $personModel();
			this.setPerspective();
			this.buildCoordinateSystem();
			this.buildHouse();
			this.setStyles();
		},
		setEvents : function(action){
			this.delegate(action);
			var model = this.model;
			var proxy = this.proxy();
			model.on('change:perspective', proxy('setPerspective'));
			model.on('change:perspectiveOrigin', proxy('setPerspective'));
		},
		setPerspective : function(){
			var model = this.model;
			this.role('root').css({
				'perspective' : model.get('perspective') + 'px',
				'perspective-origin' : model.get('perspectiveOrigin')
			});
		},
		//构建空间坐标系
		buildCoordinateSystem : function(){
			var conf = this.conf;
			this.coordinateSystem = new $CoordinateSystem({
				path : this.path,
				isSightDevice : conf.isSightDevice,
				personModel : this.personModel,
				parent : this.role('root')
			});
		},
		//构建房间
		buildHouse : function(){
			this.house = new $House({
				path : this.path,
				personModel : this.personModel,
				coordinateSystem : this.coordinateSystem
			});
		},
		setStyles : function(){
			var conf = this.conf;
			if(conf.isSightDevice){return;}
			var root = this.role('root');
			var parent = root.parent();
			var width = root.width();
			var height = root.height();
			var size = Math.min(width, height);
			var scale = 1;
			if(size <= 300){
				scale = 1;
			}else{
				scale = size / 300;
				size = 300;
			}
			root.css({
				'position' : 'absolute',
				'top' : 0,
				'left' : 0,
				'bottom' : 0,
				'right' : 0,
				'margin' : 'auto',
				'width' : size + 'px',
				'height' : Math.floor(4 * size / 3) + 'px',
				'transform-origin' : '50% 50%',
				'transform' : 'rotateZ(-90deg) scale(' + scale + ')'
			});
			parent.css({
				'position' : 'absolute'
			});
		},
		update : function(data){
			data = data || {};
			this.personModel.set(data.person);
			this.coordinateSystem.update(data.coordinateSystem);
			this.house.update(data.house);
		},
		toJSON : function(){
			var data = {};
			data.person = this.personModel.toJSON();
			data.coordinateSystem = this.coordinateSystem.toJSON();
			data.house = this.house.toJSON();
			return data;
		}
	});

	module.exports = Scene;

});

