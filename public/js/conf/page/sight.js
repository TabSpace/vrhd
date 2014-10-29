/**
 * @fileoverview 视线
 * @authors
  Tony.Liang <pillar0514@gmail.com>
 * @description 控制第一人称视角的变化，展示在VR设备上
 */
define('conf/page/sight', function(require, exports, module) {

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

