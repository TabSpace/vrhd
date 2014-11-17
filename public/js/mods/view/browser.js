/**
 * @fileoverview VR浏览器
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 在VR场景显示的浏览器
 */
define('mods/view/browser',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $socket = require('mods/channel/socket');
	var $channel = require('lib/common/channel');

	var URL = 'http://192.168.2.1:7788/dpool/blog/s/blog_49ae54740102v6t7.html?pos=99&vt=4';

	var TPL = $tpl({
		box : [
			'<div class="browser"></div>'
		]
	});

	var Browser = $view.extend({
		defaults : {
			template : TPL.box
		},
		build : function(){

		},
		show : function(){
			this.role('root').show();
		},
		hide : function(){
			this.role('root').hide();
		},
		open : function(){
			this.show();
		},
		close : function(){
			this.hide();
		}
	});

	module.exports = Browser;

});