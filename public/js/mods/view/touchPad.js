/**
 * @fileoverview 触控板
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 提供touch操作和指向标记
 */
define('mods/view/touchPad',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $touchPadModel = require('mods/model/touchPad');

	var TouchPad = $view.extend({
		defaults : {
			node : null
		},
		build : function(){

		},
		setEvents : function(){

		}
	});

	module.exports = TouchPad;

});


