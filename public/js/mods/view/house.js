/**
 * @fileoverview 房子
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房子是由多个房间构成的视觉系统
 */
define('mods/view/house',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $Room = require('mods/view/room');

	var House = $view.extend({
		defaults : {
			//任务模型
			personModel : null,
			//房子所在的坐标系
			coordinateSystem : null
		},
		build : function(){
			this.personModel = this.conf.personModel;
			this.coordinateSystem = this.conf.coordinateSystem;
			this.buildRooms();
		},
		buildRooms : function(){
			this.room = new $Room({
				personModel : this.personModel,
				coordinateSystem : this.coordinateSystem
			});
		},
		update : function(data){
			data = data || {};
			this.room.update(data.room);
		},
		toJSON : function(){
			var data = {};
			data.room = this.room.toJSON();
			return data;
		}
	});

	module.exports = House;

});
