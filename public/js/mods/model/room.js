/**
 * @fileoverview 房间模型
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 房间的数据模型
 */
define('mods/model/room',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');

	var Room = $model.extend({
		defaults : {
			//单位米转化为像素的比例
			ratio : 200,
			//长宽高，单位为米
			extent : 4,
			width : 3,
			height : 2.8,
			extentPx : 0,
			widthPx : 0,
			heightPx : 0
		},
		events : {
			'change:extent' : 'computeSize',
			'change:width' : 'computeSize',
			'change:height' : 'computeSize'
		},
		build : function(){
			this.computeSize();
		},
		computeSize : function(){
			var extent = this.get('extent');
			var width = this.get('width');
			var height = this.get('height');

			var pxSize = {};
			var ratio = this.get('ratio');
			pxSize.extentPx = extent * ratio;
			pxSize.widthPx = width * ratio;
			pxSize.heightPx = height * ratio;

			this.set(pxSize);
		}
	});

	module.exports = Room;

});



