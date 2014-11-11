/**
 * @fileoverview 显示
 * @authors
  Tony.Liang <pillar0514@gmail.com>
 * @description 用于PPT展示第一人称视角的同步影像，展示在PC上
 */
define('conf/page/vision', function(require, exports, module) {

	var $ = require('lib');
	var $scene = require('mods/view/scene');
	var $touchPad = require('mods/view/touchPad');
	var $socket = require('mods/channel/socket');

	var touchPad = new $touchPad({
		node : null
	});

	var scene;

	$('.vrscene').each(function() {
		var el = $(this);
		var type = el.attr('type');
		scene = new $scene({
			node: el,
			path : 'vr',
			isSightDevice : false,
			type: type
		});
	});

	$socket.on('scene:sync', function(data){
		scene.update(data);
	});

});

