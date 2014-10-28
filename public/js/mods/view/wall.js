/**
 * @fileoverview 墙面
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间会有多个墙面，墙面的显示由多个层完成
 */
define('mods/view/wall',function(require,exports,module){

	var $ = require('lib');
	var $plane = require('mods/view/plane');

	var Wall = $plane.extend({
		defaults : {

		},
		build : function(){

		}
	});

	module.exports = Wall;

});
