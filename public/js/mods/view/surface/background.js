/**
 * @fileoverview 表面背景
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 表面背景提供纹理和背景色
 */
define('mods/view/surface/background',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/view/surface/base');
	var $tpl = require('lib/kit/util/template');
	var $backgroundModel = require('mods/model/surface/background');

	var TPL = $tpl({
		box : '<div name="background"></div>'
	});

	var Background = $base.extend({
		defaults : {
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $backgroundModel({
				
			});
		}
	});

	module.exports = Background;

});
