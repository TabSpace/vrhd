/**
 * @fileoverview 表面层动画
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 动画表面层提供墙面切换的动画效果
 */
define('mods/view/surface/animate',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/view/surface/base');
	var $tpl = require('lib/kit/util/template');
	var $animateModel = require('mods/model/surface/animate');

	var TPL = $tpl({
		box : '<div name="animate"></div>'
	});

	var Animate = $base.extend({
		defaults : {
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $animateModel({

			});
		}
	});

	module.exports = Animate;

});
