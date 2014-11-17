/**
 * @fileoverview 操作页面幻灯片
 * @author wangqiang
 * @date 14/11/11
 */
define('mods/view/operatorGallery', function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	$mustache = require('lib/more/mustache');
	var $view = require('lib/mvc/view');

	var $limit = require('lib/kit/num/limit');
	var $tpl = require('lib/kit/util/template');

	var $slideModel = require('mods/model/slide');

	var TPL = $tpl({
		box : '<div class="thumbnail-container">\
					<ul data-role="showArea" class="show-area">\
					</ul>\
					<span class="arrow previous"></span>\
					<span class="arrow next"></span>\
				</div>',
		item : '{{#.}}<li><img class="thl-image" src="{{.}}" width="85" height="85" alt="Marsa Alam" /><div class="thl-frame"/></li>{{/.}}'
	});

	var OperatorGallery = $view.extend({
		defaults : {
			parent: null,
			template: TPL.box
		},
		build: function(){
			var conf = this.conf;
			var root = this.role('root');
			var showArea = this.role('showArea');
			this.mode = new $slideModel({
				pics: conf.pics
			});

			var itemsHtml = $mustache.render(TPL.get('item'), conf.pics);
//			html = $substitute(html, {city:'北京'}); //return '北京欢迎您'
			$(showArea).html(itemsHtml);
			$(conf.parent).append(root);
		},
		setEvents: function(){

		},
		show: function(){

		}
	});

	module.exports = OperatorGallery;
});