/**
 * @fileoverview 背景选择器
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 用于更换墙纸，地板，天花板
 */
define('mods/view/backgroundSelector',function(require,exports,module){

	var $ = require('lib');
	var $tpl = require('lib/kit/util/template');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');
	var $socket = require('mods/channel/socket');
	var $slideModel = require('mods/model/slide');
	var $mustache = require('lib/more/mustache');

	var TPL = $tpl({
		box : [
			'<div class="bg-selector"></div>'
		],
		item : [
			'{{#.}}<div class="item" style="background-image:url({{.}});"></div>{{/.}}'
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
			this.model = $slideModel;
			this.render();
		},
		setEvents : function(){
			var that = this;
			var model = this.model;
			var proxy = this.proxy();
			model.on('change:plane', proxy('selectPlane'));
			model.on('change:currentPic', proxy('render'));
		},
		render : function(){
			var model = this.model;
			var root = this.role('root');
			var pics = model.get('pics');
			if(!this.items){
				var itemHtml = TPL.get('item');
				var html = $mustache.render(itemHtml, pics);
				root.html(html);
				this.items = root.find('.item');
			}
			var items = this.items;
			var prev = [];
			var next = [];
			var index = 0;
			var cur = model.get('currentPic');
			for(index = 0; index < cur; index ++){
				prev.push(index);
			}
			for(index = cur + 1; index < pics.length; index ++){
				next.push(index);
			}
			prev.reverse().forEach(function(index, i){
				i = Math.min(i, 2);
				items.get(index).className = 'item prev' + i;
			});
			items.get(cur).className = 'item cur';
			next.forEach(function(index, i){
				i = Math.min(i, 2);
				items.get(index).className = 'item next' + i;
			});
		},
		toggle : function(plane){
			var model = this.model;
			var curPath = model.get('plane');
			if(!plane){
				model.set('plane', '');
			}else if(plane.path === curPath){
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
			var root = this.role('root');
			var plane = this.env.getObjByPath(path);
			var box = plane.surface.get('content').role('root');

			root.css({
				'width' : '400px',
				'height' : '200px'
			}).appendTo(box);
			root.transit({
				'translateX' : '-50%',
				'translateZ' : '100px'
			}, 300, 'ease-in');
		},
		//隐藏幻灯组件
		hideSlides : function(callback){
			var root = this.role('root');
			if (!root.parent().get(0)) {
				callback();
			} else {
				root.transit({
					'translateX': '-50%',
					'translateZ': 0
				}, 300, 'ease-in', function(){
					root.remove();
					callback();
				});
			}
		}
	});

	module.exports = BackgroundSelector;

});
