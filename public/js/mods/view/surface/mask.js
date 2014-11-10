/**
 * @fileoverview 遮罩物
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 提供各种平面遮罩物
 */
define('mods/view/surface/mask',function(require,exports,module){

	var $ = require('lib');
	var $base = require('mods/view/surface/base');
	var $tpl = require('lib/kit/util/template');
	var $maskModel = require('mods/model/surface/mask');

	var TPL = $tpl({
		box : '<div class="surface" name="mask"></div>'
	});

	var Mask = $base.extend({
		defaults : {
			name : 'mask',
			path : '',
			template : TPL.box,
			parent : null
		},
		getModel : function(){
			this.model = new $maskModel();
		},
		setEvents : function(){
			var proxy = this.proxy();
			var model = this.model;
			model.on('change:door', proxy('setDoor'));
			model.on('change:window', proxy('setWindow'));
			model.on('change:tv', proxy('setTV'));
		},
		setDoor : function(){
			var model = this.model;
			var data = model.get('door');
			if(!data){return;}
		},
		setWindow : function(){
			var model = this.model;
			var data = model.get('window');
			if(!data){return;}
		},
		setTV : function(){
			var model = this.model;
			var data = model.get('tv');
			if(!data){return;}
		}
	});

	module.exports = Mask;

});
