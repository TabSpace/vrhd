/**
 * @fileoverview 天花板
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 一个房间有一个天花板
 */
define('mods/view/ceiling',function(require,exports,module){

	var $ = require('lib');
	var $plane = require('mods/view/plane');

	var Ceiling = $plane.extend({
		defaults : {

		},
		build : function(){

		}
	});

	module.exports = Ceiling;

});
