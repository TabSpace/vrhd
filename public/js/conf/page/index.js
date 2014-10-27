/**
 * @fileoverview 控制台
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 控制房间变化与空间物体的展示，展示在PC上
 */
define('conf/page/index',function(require,exports,module){

	require('conf/global');

	var $scene = require('mods/view/scene');

	$('.vrscene').each(function(){
		var el = $(this);
		var type = el.attr('type');
		new $scene({
			node : el,
			type : type
		});
	});

});

