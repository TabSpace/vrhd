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

	var $slideModel = require('mods/model/slideData');

	var $socket = require('mods/channel/socket');

	var TPL = $tpl({
		box : '<div class="thb-container">\
					<div class="thb-wrapper" data-role="wrapper">\
						<ul data-role="showArea" class="thb-show-area">\
						</ul>\
					</div>\
					<a data-role="prev" href="javascript:;" title="前一组" class="thb-icons previous"></a>\
					<a data-role="next" href="javascript:;" title="后一组" class="thb-icons next"></a>\
				</div>',
		item : '{{#.}}<li data-picurl="{{.}}"><img class="thb-image" src="{{.}}" width="85" height="85" alt="墙纸" /><div data-role="thbFrame" class="thb-frame"/></li>{{/.}}'
	});

	var OperatorGallery = $view.extend({
		defaults : {
			parent: null,
			template: TPL.box,
			hasBtn: true
		},
		rootOffset : null,
		stepWidth: 0,
		totalWidth: 0,
		build: function(){
			var conf = this.conf;
			var root = $(this.role('root'));
			var showArea = $(this.role('showArea'));

			var model = this.model = $slideModel;
			if (conf.pics) {
				model.set('pics', conf.pics);
			}

			var itemsHtml = $mustache.render(TPL.get('item'), model.get('pics'));
//			html = $substitute(html, {city:'北京'}); //return '北京欢迎您'
			showArea.html(itemsHtml);
			$(conf.parent).append(root);

			root.width(490);

			showArea.css('margin-left', model.get('marginLeft'))

			this.rootOffset = root.offset();


			var lis = $('li', showArea);
			var liWidth = lis.width();
			var liMargin = parseInt(lis.css('margin-left') || 0, 0) + parseInt(lis.css('margin-right') || 0, 0);
			var singlePicWidth = liWidth + liMargin;
			var picLength = lis.length;

			var wrapper = $(this.role('wrapper'));
			var showAreaWidth = wrapper.width();
			// 这里是demo，由于3d场景内的宽高与平面内的不一样因此写上固定值
			this.stepWidth = 475;//Math.floor(showAreaWidth/singlePicWidth) * singlePicWidth;

			this.totalWidth = 1140; //picLength * singlePicWidth;
			showArea.width(5000);

			// 隐藏前一组，后一组按钮
			if (!conf.hasBtn) {
				var prevBtn = $(this.role('prev')),
					nextBtn = $(this.role('next'));

				prevBtn.hide();
				nextBtn.hide();
			} else {
				this.updateIconPos(this.rootOffset);
			}

			var model = this.model;
			model.set('width', root.width());
			model.set('height', root.height());


			var currentPic = model.get('currentPic');
			if (currentPic) {
				this.updateCurrent();
			}
		},
		setEvents: function(){
			var root = $(this.role('root'));
			var model = this.model;
			var proxy = this.proxy();
			model.on('change:hoverPic', proxy('updateHover'));
			model.on('change:currentPic', proxy('updateCurrent'));
			model.on('change:marginLeft', proxy('updateMargin'));

			$(this.role('root')).on('mouseover', 'li', function(evt){
				var picUrl = $(this).attr('data-picurl');
				model.set('hoverPic', picUrl);
			}).on('mouseout', function(){
				model.set('hoverPic', '');
			}).on('click', 'li', function(){
				var picUrl = $(this).attr('data-picurl');
				model.set('currentPic', picUrl);
			});

			var prevBtn = $(this.role('prev')),
				nextBtn = $(this.role('next'));
			prevBtn.on('click', proxy('prev'));
			nextBtn.on('click', proxy('next'));
		},
		// 更新上一组与下一组按钮的位置
		updateIconPos: function(rootOffset){
			var prevBtn = $(this.role('prev')),
				nextBtn = $(this.role('next')),
				prevOffset = prevBtn.offset(),
				nextOffset = nextBtn.offset();

			var top = (rootOffset.height - prevOffset.height)/2;
			var left = (rootOffset.width - nextOffset.width-10);
			prevBtn.css('top', top+'px');
			nextBtn.css('top', top+'px').css('left', left+'px');
		},
		// 更新当前墙纸
		updateCurrent: function(){
			var model = this.model;
			var currentPic = model.get('currentPic');
			var root = this.role('root');
			$('li', this.role('root')).each(function(){
				var liEl = $(this);
				var picUrl = liEl.attr('data-picurl');
				if (currentPic == picUrl) {
					liEl.addClass('current');
					liEl.removeClass('hover');
				} else {
					liEl.removeClass('current');
				}
			});
			$socket.trigger('syn:wallpaperChange', model);
		},
		// 更新hover状态
		updateHover: function(){
			var model = this.model;
			var hoverPic = model.get('hoverPic');
			var root = this.role('root');
			$('li', this.role('root')).each(function(){
				var liEl = $(this);
				var picUrl = liEl.attr('data-picurl');
				if (!liEl.hasClass('current') && hoverPic == picUrl) {
					liEl.addClass('hover');
				} else {
					liEl.removeClass('hover');
				}
			});
		},
		// 上一组与下一组margin切换
		updateMargin: function(){
			var showArea = $(this.role('showArea'));
			var marginLeft = this.model.get('marginLeft');
			showArea.css('margin-left', marginLeft);
			$socket.trigger('syn:wallpaperChange', this.model.get());
		},
		// 显示上一组
		next: function(){
			var showArea = $(this.role('showArea'));
			var marginLeft = parseInt(showArea.css('margin-left') || 0);
			var afterMarginLeft = marginLeft-this.stepWidth
			if (this.totalWidth <= Math.abs(afterMarginLeft)) {
				return
			} else {
				this.model.set('marginLeft', afterMarginLeft+'px');
			}
		},
		// 显示下一组
		prev: function(){
			var showArea = $(this.role('showArea'));

			var marginLeft = parseInt(showArea.css('margin-left') || 0);
			var afterMarginLeft = marginLeft+this.stepWidth;

			if (marginLeft == 0) {
				return;
			} else if (0 < afterMarginLeft) {
				afterMarginLeft = 0
			}
			this.model.set('marginLeft', afterMarginLeft+'px');
		},
		// 显示幻灯片
		show: function(){
			var root = $(this.role('root'));
			root.show();
		},
		// 隐藏幻灯片
		hide: function(){
			var root = $(this.role('root'));
			root.hide();
		},
		// 销毁幻灯片
		destroy: function () {

		}

	});

	module.exports = OperatorGallery;
});