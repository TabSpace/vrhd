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
			//所在的坐标系
			coordinateSystem : null
		},
		build : function(){
			this.model = new $roomModel();
			this.buildGround();
		},
		buildGround : function(){
			this.ground = $('<div></div>');
		},
		buildFloor : function(){

		},
		buildWalls : function(){

		},
		buildCeiling : function(){

		}
	});

	module.exports = Room;

});
