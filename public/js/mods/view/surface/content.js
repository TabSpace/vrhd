/**
 * @fileoverview 内容层
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 提供基于平面的交互内容
 */
define('mods/view/surface/content',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/view/surface/base');
	var $tpl = require('lib/kit/util/template');
	var $contentModel = require('mods/model/surface/content');

	var TPL = $tpl({
		box : '<div class="surface" name="content"></div>'
	});

	var Content = $base.extend({
		defaults : {
			name : 'content',
			path : '',
			//环境对象
			env : null,
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $contentModel();
		}
	});

	module.exports = Content;

});
