/**
 * @fileoverview 外景层
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 外景层提供房间外景的模拟效果
 */
define('mods/view/surface/outerScene',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/view/surface/base');
	var $tpl = require('lib/kit/util/template');
	var $outerSceneModel = require('mods/model/surface/outerScene');

	var TPL = $tpl({
		box : '<div class="surface" name="outer-scene"></div>'
	});

	var OuterScene = $base.extend({
		defaults : {
			name : 'outerScene',
			path : '',
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $outerSceneModel({
				
			});
		}
	});

	module.exports = OuterScene;

});
