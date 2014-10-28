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
			node : null,
			isSightDevice : true,
			type : 'front'
		},
		build : function(){
			var conf = this.conf;
			this.model = new $sceneModel({
				type : conf.type
			});
			this.personModel = new $personModel();
			this.setPerspective();
			this.buildCoordinateSystem();
			this.buildHouse();
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
				isSightDevice : conf.isSightDevice,
				personModel : this.personModel,
				parent : this.role('root')
			});
		},
		//构建房间
		buildHouse : function(){
			this.house = new $House({
				personModel : this.personModel,
				coordinateSystem : this.coordinateSystem
			});
		}
	});

	module.exports = Scene;

});

