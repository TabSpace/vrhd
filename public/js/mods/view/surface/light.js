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
		box : '<div class="surface" name="light"></div>'
	});

	var Light = $base.extend({
		defaults : {
			name : 'light',
			path : '',
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $lightModel();
		},
		setStyles : function(){
			var model = this.model;
			var root = this.role('root');
			root.css({
				'background' : 'radial-gradient(' + [
					'farthest-corner at 60% 55%',
					'rgba(255,255,255,0.5)',
					'rgba(0,0,0,0.5)'
				].join() + ')'
			});
		}
	});

	module.exports = Light;

});


