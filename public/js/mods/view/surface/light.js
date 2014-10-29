/**
 * @fileoverview 光线层
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 光线层提供平面的光影效果
 */
define('mods/view/surface/light',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/view/surface/base');
	var $tpl = require('lib/kit/util/template');
	var $lightModel = require('mods/model/surface/light');

	var TPL = $tpl({
		box : '<div></div>'
	});

	var Light = $base.extend({
		defaults : {
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $lightModel({

			});
		}
	});

	module.exports = Light;

});


