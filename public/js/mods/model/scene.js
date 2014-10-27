/**
 * @fileoverview 场景模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 显示3D场景的界面
 */
define('mods/model/scene',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var Scene = $model.extend({
		defaults : {
			type : 'front',
			perspective : 150,
			perspectiveOrigin : '50% 50%'
		},
		events : {
			'change:type' : 'compute'
		},
		build : function(){
			this.compute();
		},
		compute : function(){
			var type = this.get('type');
			if(type === 'left'){
				this.set('perspectiveOrigin', '50% 45%');
			}else if(type === 'right'){
				this.set('perspectiveOrigin', '50% 55%');
			}else{
				this.set('perspectiveOrigin', '50% 50%');
			}
		}
	});

	module.exports = Scene;

});

