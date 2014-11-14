/**
 * @fileoverview 图片预加载
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 */
define('mods/util/preload',function(require,exports,module){

	var $ = require('lib');

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

	//使用并行加载方式
	module.exports = function(options){
		options = options || {};
		var length = preLoadImages.length;
		if($.type(options.onStart) === 'function'){
			options.onStart(length);
		}

		var count = 0;
		preLoadImages.forEach(function(src){
			var img = new Image();
			src = 'images/' + src;
			var cb = function(){
				count++;
				if($.type(options.onStep) === 'function'){
					options.onStep(count, length);
				}
				if(count >= length){
					if($.type(options.onComplete) === 'function'){
						options.onComplete();
					}
				}
			};
			img.onload = cb;
			img.onerror = cb;
			img.src = src;
		});
	};

});


