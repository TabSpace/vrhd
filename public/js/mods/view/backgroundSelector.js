/**
 * @fileoverview 背景选择器
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 用于更换墙纸，地板，天花板
 */
define('mods/view/backgroundSelector',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');

	var $view = require('lib/mvc/view');
	var $socket = require('mods/channel/socket');
	var $bgModel = require('mods/model/backgroundSelector');

	var TPL = $tpl({
		box : [
			'<div class="bg-selector"></div>'
		]
	});

	var BackgroundSelector = $view.extend({
		defaults : {
			//环境公共对象
			env : null,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.env = conf.env;
			this.model = new $bgModel({

			});
		},
		setEvents : function(){
			var model = this.model;
			var proxy = this.proxy();
			model.on('change:plane', proxy('selectPlane'));
		},
		toggle : function(plane){
			var model = this.model;
			var curPath = model.get('plane');
			if(plane.path === curPath){
				model.set('plane', '');
			}else{
				model.set('plane', plane.path);
			}
		},
		//选择所在的平面
		selectPlane : function(){
			var model = this.model;
			var root = this.role('root');
			var path = model.get('plane');
			var that = this;
			this.hideSlides(function(){
				if(!path){return;}
				that.showSlides(path);
			});
		},
		//显示幻灯组件
		showSlides : function(path){
			var plane = this.env.getObjByPath(path);
			var box = plane.surface.get('content').role('root');
			var root = this.role('root');
			var width = plane.model.get('width');
			var height = plane.model.get('height');
			root.css({
				'width' : width / 2 + 'px',
				'height' : Math.min(100, height) + 'px',
			}).appendTo(box);
			root.transit({
				'translateX' : '-50%',
				'translateZ' : '100px'
			}, 300, 'ease-in');
		},
		//隐藏幻灯组件
		hideSlides : function(callback){
			var root = this.role('root');
			if(!root.parent().get(0)){
				callback();
			}else{
				root.transit({
					'translateX' : '-50%',
					'translateZ' : 0
				}, 300, 'ease-in', function(){
					root.remove();
					callback();
				});
			}
		}
	});

	module.exports = BackgroundSelector;

});
