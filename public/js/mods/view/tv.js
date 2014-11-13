/**
 * @fileoverview 电视机
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 电视机提供进一步交互功能
 */
define('mods/view/tv',function(require,exports,module){

	var $ = require('lib');
	var $model = require('lib/mvc/model');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $socket = require('mods/channel/socket');
	var $channel = require('lib/common/channel');

	var TPL = $tpl({
		'box' : [
			'<div class="mask" name="tv">',
				'<div class="bg"></div>',
				'<div class="inner"></div>',
				'<div class="outer"></div>',
			'</div>'
		]
	});

	var TV = $view.extend({
		defaults : {
			env : null,
			plane : null,
			parentNode : null,
			template : TPL.box
		},
		build : function(){
			var conf = this.conf;
			var root = this.role('root');
			this.model = new $model({
				top : conf.top,
				left : conf.left,
				width : conf.width,
				height : conf.height,
				style : conf.style,
				screenHeight : conf.screenHeight
			});
			this.state = new $model({
				hover : false,
				top : 0,
				right : 0,
				bottom : 0,
				left : 0
			});
			this.env = conf.env;
			root.appendTo(conf.parentNode);
			this.bg = root.find('.bg');
			this.inner = root.find('.inner');
			this.outer = root.find('.outer');
			this.setStyles();
		},
		setEvents : function(){
			var proxy = this.proxy();
			var model = this.model;
			var plane = this.conf.plane;
			var state = this.state;
			model.on('change', proxy('setStyles'));
			state.on('change:hover', proxy('checkHoverStyle'));
			plane.pointerModel.on('change', proxy('checkHover'));
			plane.model.on('change:bePointed', proxy('checkHover'));
			$socket.on('touchpad:event', proxy('checkEvent'));
		},
		setStyles : function(){
			var root = this.role('root');
			var env = this.env;
			var ratio = env.getRatio();
			var model = this.model;
			var data = model.get();
			root.css({
				'position' : 'absolute',
				'overflow' : 'hidden',
				'top' : data.top * ratio + 'px',
				'left' : data.left * ratio + 'px',
				'width' : data.width * ratio + 'px',
				'height' : data.height * ratio + 'px'
			});
			this.bg.css({
				'position' : 'absolute',
				'top' :0,
				'left' : 0,
				'background-image' : 'radial-gradient(farthest-corner at 60% 25%,#666, #000)',
				'width' : data.width * ratio + 'px',
				'height' : data.screenHeight * ratio + 'px'
			});
			this.inner.css({
				'position' : 'absolute',
				'top' :0,
				'left' : 0,
				'opacity' : 0,
				'background-image' : 'url(images/inner4.gif)',
				'transition' : 'opacity 0.3s ease',
				'width' : data.width * ratio + 'px',
				'height' : data.screenHeight * ratio + 'px'
			});
			this.outer.css({
				'position' : 'absolute',
				'top' :0,
				'left' : 0,
				'background-image' : 'url(' + data.style + ')',
				'background-size' : 'cover',
				'background-repeat' : 'no-repeat',
				'width' : data.width * ratio + 'px',
				'height' : data.height * ratio + 'px'
			});
			this.state.set({
				top : data.top * ratio,
				right : data.left * ratio + data.width * ratio,
				bottom : data.top * ratio + data.height * ratio,
				left : data.left * ratio
			});
		},
		checkHover : function(){
			var plane = this.conf.plane;
			var pos = plane.pointerModel.get();
			var coordinates = this.state.get();
			if(
				plane.model.get('bePointed') &&
				pos.x > coordinates.left &&
				pos.x < coordinates.right &&
				pos.y > coordinates.top &&
				pos.y < coordinates.bottom
			){
				this.state.set('hover', true);
			}else{
				this.state.set('hover', false);
			}
		},
		checkHoverStyle : function(){
			var state = this.state;
			var plane = this.conf.plane;
			if(state.get('hover')){
				this.inner.css('opacity', 1);
			}else{
				this.inner.css('opacity', 0);
			}
		},
		checkEvent : function(event){
			event = event || {};
			if(!this.state.get('hover')){return;}
			if(!event.type){return;}
			if(event.type === 'tap'){
				this.hide();
				$channel.trigger('on-tv-tap');
			}
		},
		update : function(data){
			this.model.set(data);
		},
		show : function(){
			this.role('root').show();
		},
		hide : function(){
			this.role('root').hide();
		}
	});

	module.exports = TV;

});

