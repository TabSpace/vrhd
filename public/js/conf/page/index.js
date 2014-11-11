/**
 * @fileoverview 控制台
 * @authors
  Tony.Liang <pillar0514@gmail.com>
 * @description 控制房间变化与空间物体的展示，展示在PC上
 */
define('conf/page/index', function(require, exports, module) {

	var $ = require('lib');
	var $scene = require('mods/view/scene');
	var $touchPad = require('mods/view/touchPad');
	var $operatorGallery = require('mods/view/operatorGallery');

	var touchPad = new $touchPad({
		node : null
	});

	$('.vrscene').each(function(){
		var el = $(this);
		var type = el.attr('type');
		var scene = new $scene({
			node: el,
			path : 'vr',
			isSightDevice : false,
			type: type
		});

		setTimeout(function(){
			var sceneData = scene.toJSON();
			console.log('sceneData:', sceneData);
		}, 1000);
	});

	$('.gallery-box').each(function(){
		var el = $(this);

		var gallery = new $operatorGallery({
			node: el
		});
		gallery.show();
	});

});

