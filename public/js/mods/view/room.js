/**
 * @fileoverview 房间
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间是由地板，天花板和四面墙组成的视觉系统
 */
define('mods/view/room',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $wall = require('mods/view/wall');
	var $floor = require('mods/view/floor');
	var $ceiling = require('mods/view/ceiling');
	var $roomModel = require('mods/model/room');

	var Room = $view.extend({
		defaults : {
			//人物模型
			personModel : null,
			//所在的坐标系
			coordinateSystem : null
		},
		build : function(){
			var conf = this.conf;
			this.model = new $roomModel();
			this.personModel = conf.personModel;
			this.coordinateSystem = conf.coordinateSystem;
			this.buildGround();
			this.buildFloor();
			this.buildWalls();
			this.buildCeiling();
			this.updateSize();
			this.updateEyePos();
		},
		setEvents : function(action){
			var model = this.model;
			var proxy = this.proxy();
			var personModel = this.personModel;
			this.delegate(action);
			model.on('change:widthPx', proxy('updateSize'));
			model.on('change:heightPx', proxy('updateSize'));
			model.on('change:extentPx', proxy('updateSize'));
			personModel.on('change:eyeHeight', proxy('updateEyePos'));
		},
		buildGround : function(){
			this.ground = $('<div></div>').css({
				'position': 'absolute',
				'top':'50%',
				'left': '50%',
				'backface-visibility':'hidden',
				'transform-origin':'50% 50%',
				'transform-style':'preserve-3d',
				'background-color' : 'rgba(0,0,0,0.5)'
			});
			this.ground.appendTo(this.coordinateSystem.role('root'));
		},
		buildFloor : function(){
			var model = this.model;
			this.floor = new $floor({
				ground : this.ground,
				width : model.get('widthPx'),
				height : model.get('extentPx')
			});
		},
		buildWalls : function(){
			var model = this.model;
			var extent = model.get('extentPx');
			var width = model.get('widthPx');
			var height = model.get('heightPx');

			console.log('width:', width);
			console.log('height', height);
			console.log('extent', extent);

			this.left = new $wall({
				ground : this.ground,
				distance : width / 2,
				width : extent,
				height : height,
				type : 'left'
			});
			this.right = new $wall({
				ground : this.ground,
				distance : width / 2,
				width : extent,
				height : height,
				type : 'right'
			});
			this.front = new $wall({
				ground : this.ground,
				distance : extent / 2,
				width : width,
				height : height,
				type : 'front'
			});
			this.behind = new $wall({
				ground : this.ground,
				distance : extent / 2,
				width : width,
				height : height,
				type : 'behind'
			});
		},
		buildCeiling : function(){
			var model = this.model;
			this.ceiling = new $ceiling({
				ground : this.ground,
				distance : model.get('heightPx'),
				width : model.get('widthPx'),
				height : model.get('extentPx')
			});
		},
		updateEyePos : function(){
			var eyeHeight = this.personModel.get('eyeHeight');
			var ratio = this.model.get('ratio');
			eyeHeightPx = eyeHeight * ratio;
			this.ground.transform({
				'translateX' : '0',
				'translateY' : '0',
				'translateZ' : eyeHeightPx + 'px',
				'rotateX' : '180deg',
				'rotateZ' : '180deg'
			});
		},
		updateSize : function(){
			var model = this.model;
			var extent = model.get('extentPx');
			var width = model.get('widthPx');
			var height = model.get('heightPx');

			this.ground.css({
				'margin-left' : 0 - width / 2 + 'px',
				'margin-top' : 0 - extent / 2 + 'px',
				'width' : width + 'px',
				'height' : extent + 'px',
			});
		}
	});

	module.exports = Room;

});
