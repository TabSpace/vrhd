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
	
	var $demoData = require('mods/data/demo');
	var $socket = require('mods/channel/socket');
	var $sceneInfo = require('mods/view/sceneInfo');

	var $operatorGallery = require('mods/view/operatorGallery');

	var touchPad = new $touchPad({
		node : null
	});

	var scene;

	$('.vrscene').each(function(){
		var el = $(this);
		var type = el.attr('type');
		scene = new $scene({
			node: el,
			path : 'vr',
			isSightDevice : false,
			type: type
		});
	});

	var gallery = new $operatorGallery({
		parent : $('.gallery-box')
	});

	scene.update($demoData);

	window.scene = scene;

	scene.update($demoData);
	setTimeout(function(){
		$socket.trigger('scene:sync', scene.toJSON());
	}, 1000);

	var sceneInfo = new $sceneInfo({
		parent : $('.scene-info'),
		scene : scene
	});

});

