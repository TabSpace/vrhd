/**
 * @fileoverview 场景信息
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 输出场景信息到控制台页面，方便调试
 */
define('mods/view/sceneInfo',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $mustache = require('lib/more/mustache');
	var $touchPadModel = require('mods/model/touchPad');

	var TPL = $tpl({
		box : [
			'<div>',
				'<div class="mb10">',
					'<strong>观察位置</strong>',
					'<div data-role="person"></div>',
				'</div>',
				'<div class="mb10">',
					'<strong>触控板</strong>',
					'<div data-role="touch-pad"></div>',
				'</div>',
				'<div class="mb10">',
					'<strong>坐标系</strong>',
					'<div data-role="coordinate"></div>',
				'</div>',
				'<div class="mb10">',
					'<strong>场景视图</strong>',
					'<div data-role="scene"></div>',
				'</div>',
			'</div>'
		],
		list : [
			'{{#.}}<p>{{name}} : {{value}}</p>{{/.}}'
		]
	});

	var SceneInfo = $view.extend({
		defaults : {
			template : TPL.box,
			//场景信息输出元素：
			parent : null,
			//场景对象
			scene : null
		},
		build : function(){
			var conf = this.conf;
			this.role('root').appendTo(conf.parent);
			this.scene = conf.scene;
			this.updateInfo();
		},
		setEvents : function(){
			var proxy = this.proxy();
			this.scene.model.on('change', proxy('updateSceneInfo'));
			this.scene.personModel.on('change', proxy('updatePersonInfo'));
			this.scene.coordinateSystem.model.on('change', proxy('updateCoordinateSysInfo'));
			$touchPadModel.on('change', proxy('updateTouchPadInfo'));
		},
		updateInfo : function(){
			this.updateSceneInfo();
			this.updatePersonInfo();
			this.updateCoordinateSysInfo();
			this.updateTouchPadInfo();
		},
		updateSceneInfo : function(){
			this.updateTargetInfo(
				'scene',
				this.scene.model.get()
			);
		},
		updatePersonInfo : function(){
			this.updateTargetInfo(
				'person',
				this.scene.personModel.get()
			);
		},
		updateCoordinateSysInfo : function(){
			this.updateTargetInfo(
				'coordinate',
				this.scene.coordinateSystem.model.get()
			);
		},
		updateTouchPadInfo : function(){
			this.updateTargetInfo(
				'touch-pad',
				$touchPadModel.get()
			);
		},
		updateTargetInfo : function(target, data){
			var list = [];
			$.each(data, function(name, val){
				list.push({
					name : name,
					value : val
				});
			});
			var html = $mustache.render(TPL.get('list'), list);
			this.role(target).html(html);
		}
	});

	module.exports = SceneInfo;

});

