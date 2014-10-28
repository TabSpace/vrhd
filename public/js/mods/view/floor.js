/**
 * @fileoverview 地板
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间有一个地板
 */
define('mods/view/floor',function(require,exports,module){

	var $ = require('lib');
	var $plane = require('mods/view/plane');

	var Floor = $plane.extend({
		defaults : {

		},
		build : function(){

		}
	});

	module.exports = Floor;

});
