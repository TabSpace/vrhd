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
	var $touchPad = require('mods/view/touchPad');

	var touchPad = new $touchPad({
		node : null
	});

	$('.vrscene').each(function() {
		var el = $(this);
		var type = el.attr('type');
		var scene = new $scene({
			node: el,
			path : 'vr',
			isSightDevice : true,
			type: type
		});
	});

	var preventDefault = function(evt){
		if(evt && evt.preventDefault){
			evt.preventDefault();
		}
	};

	$(document).on('touchstart', preventDefault);
	$(document).on('touchmove', preventDefault);
	$(document).on('touchend', preventDefault);

});

