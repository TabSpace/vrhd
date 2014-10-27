/**
 * @fileoverview 封装socket广播
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */
define('mods/channel/socket',function(require,exports,module){

	var $listener = require('lib/common/listener');
	module.exports = new $listener([
		//设备方向感应
		'deviceorientation'
	]);
});
