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
			//房子所在的坐标系
			coordinateSystem : null
		},
		build : function(){
			this.coordinateSystem = this.conf.coordinateSystem;
			this.buildRooms();
		},
		buildRooms : function(){
			var conf = this.conf;
			this.room = new $Room({
				coordinateSystem : conf.coordinateSystem
			});
		}
	});

	module.exports = House;

});
