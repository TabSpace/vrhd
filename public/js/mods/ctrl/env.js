/**
 * @fileoverview 存储环境变量
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 作为每个场景的全局变量，存储多项公共数据
 */
define('mods/ctrl/env',function(require,exports,module){

	var $ctrl = require('lib/mvc/controller');
	var $socket = require('mods/channel/socket');
	var $bgSelector = require('mods/view/backgroundSelector');

	var Env = $ctrl.extend({
		defaults : {
			scene : null
		},
		build : function(){
			var conf = this.conf;
			this.scene = conf.scene;
		},
		setEvents : function(){
			var proxy = this.proxy();
			$socket.on('toggle-bg-selector', proxy('toggleBgSelector'));
		},
		//获取场景比例
		getRatio : function(){
			return 200;
		},
		//根据路径获取对象
		getObjByPath : function(path){
			return this.scene.getObjByPath(path);
		},
		toggleBgSelector : function(path){
			if(!this.bgSelector){
				this.bgSelector = new $bgSelector({
					env : this
				});
			}
			this.bgSelector.toggle(path);
		}
	});

	module.exports = Env;

});