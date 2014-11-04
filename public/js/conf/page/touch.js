/**
 * @fileoverview 触控板
 * @authors
  Tony.Liang <pillar0514@gmail.com>
 * @description 模拟激光笔的原理与VR场景交互
 */
define('conf/page/touch', function(require, exports, module) {

	require('conf/global');

	var $ = require('lib');
	var $touchPad = require('mods/view/touchPad');

	var touchPad = new $touchPad({
		node : $('#touch-pad')
	});

});

