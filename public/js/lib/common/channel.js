/**
 * @fileoverview 公共广播频道
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('lib/common/channel',function(require,exports,module){

	var $listener = require('lib/common/listener');
	module.exports = new $listener([
		//触发场景切换回房间的操作
		'back-to-room',
		//房间切换墙面的显示与隐藏
		'room-show-face',
		'room-hide-face',
		//电视被点击时
		'on-tv-tap',
		//桌面被隐藏后
		'on-desktop-hide'
	]);
});
