/**
 * @fileoverview 显示
 * @authors
  Tony.Liang <pillar0514@gmail.com>
 * @description 用于PPT展示第一人称视角的同步影像，展示在PC上
 */
define('conf/page/vision', function(require, exports, module) {

	require('conf/global');

	var $ = require('lib');
	var $scene = require('mods/view/scene');
	var $socket = require('mods/socket/client');

	$socket.init();

	$socket.on('update', function(data) {
		console.log('socket update', data);
	});

	$('.vrscene').each(function() {
		var el = $(this);
		var type = el.attr('type');
		new $scene({
			node: el,
			type: type
		});
	});

});

