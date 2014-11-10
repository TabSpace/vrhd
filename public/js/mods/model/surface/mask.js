/**
 * @fileoverview 遮罩物模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 遮罩物模型
 */
define('mods/model/surface/mask',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/model/surface/base');

	var Mask = $base.extend({
		'door' : null,
		'tv' : null,
		'window' : null
	});

	module.exports = Mask;

});
