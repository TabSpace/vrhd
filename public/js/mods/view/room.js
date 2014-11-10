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
	var $touchPadModel = require('mods/model/touchPad');

	var Room = $view.extend({
		defaults : {
			name : 'room',
			path : '',
			//人物模型
			personModel : null,
			//所在的坐标系
			coordinateSystem : null
		},
		build : function(){
			var conf = this.conf;
			this.path = [conf.path, conf.name].join('.');
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
		//构建地面
		buildGround : function(){
			this.ground = $('<div class="ground" name="ground"></div>');
			this.ground.appendTo(this.coordinateSystem.role('root'));
		},
		//构建地板
		buildFloor : function(){
			var model = this.model;
			this.floor = new $floor({
				path : this.path,
				ground : this.ground,
				width : model.get('widthPx'),
				height : model.get('extentPx')
			});
		},
		//构建墙面
		buildWalls : function(){
			var model = this.model;
			var extent = model.get('extentPx');
			var width = model.get('widthPx');
			var height = model.get('heightPx');

			this.left = new $wall({
				name : 'left',
				path : this.path,
				ground : this.ground,
				distance : width / 2,
				width : extent,
				height : height,
				type : 'left'
			});
			this.right = new $wall({
				name : 'right',
				path : this.path,
				ground : this.ground,
				distance : width / 2,
				width : extent,
				height : height,
				type : 'right'
			});
			this.front = new $wall({
				name : 'front',
				path : this.path,
				ground : this.ground,
				distance : extent / 2,
				width : width,
				height : height,
				type : 'front'
			});
			this.behind = new $wall({
				name : 'behind',
				path : this.path,
				ground : this.ground,
				distance : extent / 2,
				width : width,
				height : height,
				type : 'behind'
			});
		},
		//构建天花板
		buildCeiling : function(){
			var model = this.model;
			this.ceiling = new $ceiling({
				path : this.path,
				ground : this.ground,
				distance : model.get('heightPx'),
				width : model.get('widthPx'),
				height : model.get('extentPx')
			});
		},
		//更新眼镜和触控板所在的位置
		updateEyePos : function(){
			var eyeHeight = this.personModel.get('eyeHeight');
			var padHeight = this.personModel.get('padHeight');
			var ratio = this.model.get('ratio');
			var eyeHeightPx = eyeHeight * ratio;
			var padHeightPx = padHeight * ratio;
			this.ground.transform({
				'translateX' : '0',
				'translateY' : '0',
				'translateZ' : eyeHeightPx + 'px',
				'rotateX' : '180deg',
				'rotateZ' : '180deg'
			});
			$touchPadModel.set({
				'padHeight' : padHeightPx,
				'eyeHeight' : eyeHeightPx
			});
		},
		//更新房间大小
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
		},
		update : function(data){
			var that = this;
			data = data || {};
			this.model.set(data.room);
			[
				'floor',
				'ceiling',
				'front',
				'behind',
				'left',
				'right'
			].forEach(function(name){
				that[name].update(data[name]);
			});
		},
		toJSON : function(){
			var that = this;
			var data = {};
			data.room = this.model.get();
			[
				'floor',
				'ceiling',
				'front',
				'behind',
				'left',
				'right'
			].forEach(function(name){
				data[name] = that[name].toJSON();
			});
			return data;
		}
	});

	module.exports = Room;

});
