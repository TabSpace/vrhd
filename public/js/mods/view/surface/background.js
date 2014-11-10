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
		box : '<div class="surface" name="background"></div>'
	});

	var Background = $base.extend({
		defaults : {
			name : 'background',
			path : '',
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $backgroundModel({
				color : '#ddd',
				image : ''
			});
		},
		setEvents : function(action){
			this.delegate(action);
			var proxy = this.proxy();
			var model = this.model;
			model.on('change:color', proxy('setStyles'));
			model.on('change:image', proxy('setStyles'));
		},
		setStyles : function(){
			var model = this.model;
			var color = model.get('color');
			var image = model.get('image');
			var root = this.role('root');
			if(image){
				root.css({
					'background-image' : 'url(' + image + ')'
				});
			}else if(color){
				root.css('background-color', color);
			}
		}
	});

	module.exports = Background;

});
