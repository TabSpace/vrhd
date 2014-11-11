/**
 * @fileoverview 操作页面幻灯片
 * @author wangqiang
 * @date 14/11/11
 */
define('mods/view/operatorGallery', function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $mustache = require('lib/more/mustache');

	var $slideModel = require('mods/model/slide');

	var TPL = $tpl({
		box : '<div class="thumbnail-container">\
					<ul class="show-area">\
						<li><img src="/images/slide/1.jpg" width="85" height="85" alt="Marsa Alam" /></li>\
						<li><img src="/images/slide/2.jpg" width="85" height="85" alt="Turrimetta Beach" /></li>\
						<li><img src="/images/slide/3.jpg" width="85" height="85" alt="Power Station" /></li>\
						<li><img src="/images/slide/4.jpg" width="85" height="85" alt="Colors of Nature" /></li>\
					</ul>\
					<span class="arrow previous"></span>\
					<span class="arrow next"></span>\
				</div>'
	});

	var OperatorGallery = $view.extend({
		defaults : {
			node: null
		},
		build: function(){
			var conf = this.conf;
			var html = TPL.box;
			this.mode = new $slideModel({
				pics: conf.pics
			});
			html = $substitute(html, {city:'北京'}); //return '北京欢迎您'
			conf.node.html(html);
		},
		setEvents: function(){

		}
	});

	module.exports = OperatorGallery;
});