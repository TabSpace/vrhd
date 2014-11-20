/**
 * @fileoverview 操作页面幻灯片
 * @author wangqiang
 * @date 14/11/11
 */
define('mods/view/operatorGallery', function(require,exports,module){

	var $ = require('lib');
	var $mustache = require('lib/more/mustache');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $limit = require('lib/kit/num/limit');
	var $socket = require('mods/channel/socket');
	var $slideModel = require('mods/model/slide');

	var TPL = $tpl({
		box : [
			'<div class="thb-container">',
				'<div class="thb-wrapper" data-role="wrapper">',

				'</div>',
				'<a data-role="prev" href="javascript:;" title="前一组" class="thb-icons previous"></a>',
				'<a data-role="next" href="javascript:;" title="后一组" class="thb-icons next"></a>',
			'</div>'
		],
		item : [
			'{{#.}}<div class="thb-image" style="background-image:url({{.}});"></div>{{/.}}'
		]
	});

	var OperatorGallery = $view.extend({
		defaults : {
			parent: null,
			template: TPL.box
		},
		build: function(){
			var conf = this.conf;
			var root = this.role('root');
			this.model = $slideModel;
			root.appendTo(conf.parent);
			this.setStyles();
			this.render();
		},
		setEvents: function(){
			var root = $(this.role('root'));
			var model = this.model;
			var proxy = this.proxy();
			root.delegate('.cur', 'click', proxy('selectPic'));
			root.delegate('.thb-image', 'click', proxy('moveTo'));
			root.delegate('[data-role="prev"]', 'click', proxy('prev'));
			root.delegate('[data-role="next"]', 'click', proxy('next'));
			model.on('change:currentPic', proxy('render'));
		},
		setStyles : function(){

		},
		render : function(){
			var model = this.model;
			var root = this.role('root');
			var pics = model.get('pics');
			if(!this.items){
				var itemHtml = TPL.get('item');
				var html = $mustache.render(itemHtml, pics);
				this.role('wrapper').html(html);
				this.items = root.find('.thb-image');
				this.items.each(function(index){
					$(this).attr('pid', index);
				});
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
				i = Math.min(i, 4);
				items.get(index).className = 'thb-image prev' + i;
			});
			items.get(cur).className = 'thb-image cur';
			next.forEach(function(index, i){
				i = Math.min(i, 4);
				items.get(index).className = 'thb-image next' + i;
			});
		},
		//选择该墙纸
		selectPic : function(evt){
			var el = $(evt.currentTarget);
			if(el.hasClass('cur')){
				var pid = el.attr('pid');
				var index = parseInt(pid, 10);

			}
		},
		next : function(){
			var model = this.model;
			var cur = model.get('currentPic');
			this.slideTo(cur + 1);
		},
		prev : function(){
			var model = this.model;
			var cur = model.get('currentPic');
			this.slideTo(cur - 1);
		},
		//移动图册到点击事件指定的墙纸
		moveTo : function(evt){
			var el = $(evt.currentTarget);
			if(el.hasClass('cur')){return;}
			if(el.css('opacity') === '0'){return;}
			var index = el.attr('pid');
			index = parseInt(index, 10);
			this.slideTo(index);
		},
		//移动图册到指定序号的墙纸
		slideTo : function(index){
			var model = this.model;
			var pics = model.get('pics');
			index = index || 0;
			index = $limit(index, 0, pics.length - 1);
			model.set('currentPic', index);
		},
		// 显示幻灯片
		show: function(){
			this.role('root').show();
		},
		// 隐藏幻灯片
		hide: function(){
			this.role('root').hide();
		}
	});

	module.exports = OperatorGallery;
});