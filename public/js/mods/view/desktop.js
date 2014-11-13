/**
 * @fileoverview 系统桌面
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 有电视的墙面可以成为系统桌面
 */
define('mods/view/desktop',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');

	var TPL = $tpl({
		box : [
			'<div class="desktop">',
				'<div class="background"></div>',
				'<div class="icons" style="display:none;">',

				'</div>',
			'</div>'
		]
	});

	var Desktop = $view.extend({
		defaults : {
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			this.model = new $model({

			});
		},
		fxIn : function(){

		},
		fxOut : function(){

		}
	});

	module.exports = Desktop;

});

