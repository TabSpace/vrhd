/**
 * @fileoverview 图片预加载
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 */
define('mods/ctrl/preload',function(require,exports,module){

	var $ = require('lib');
	var $ctrl = require('lib/mvc/controller');

	var preLoadImages = [
		'door/door1.jpg',
		'door/door2.jpg',
		'door/door3.jpg',
		'floor/floor1.jpg',
		'icon/icon1.png',
		'icon/icon2.png',
		'icon/icon3.png',
		'icon/icon4.png',
		'icon/icon5.png',
		'icon/icon6.png',
		'icon/icon7.png',
		'icon/icon8.png',
		'icon/icon9.png',
		'inner/inner1.gif',
		'outer/outer1.gif',
		'pic/pic1.jpg',
		'pic/pic2.png',
		'tv/tv1.png',
		'wall/wall1.jpg',
		'wall/wall2.jpg',
		'wall/wall3.png',
		'wall/wall4.jpg',
		'wallpaper/wp1.jpg',
		'window/win1.png'
	];

	var Preloader = $ctrl.extend({
		getCount : function(){
			return preLoadImages.length;
		},
		start : function(){
			var that = this;
			if(this.started){return;}
			this.started = true;

			var length = preLoadImages.length;
			this.trigger('start', length);

			var count = 0;
			preLoadImages.forEach(function(src){
				var img = new Image();
				src = 'images/' + src;
				var cb = function(){
					count++;
					that.trigger('step', count, length);
					if(count >= length){
						that.trigger('complete');
					}
				};
				img.onload = cb;
				img.onerror = cb;
				img.src = src;
			});
		}
	});

	module.exports = new Preloader();

});


