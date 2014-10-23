define('config',function(require,exports,module){

	var config = {
		alias:{
			'lib':'lib/core/chaos/zepto'
		}
	};

	if(lithe.debug){
		config.timestamp = Date.now();
	}

	module.exports = config;
});

