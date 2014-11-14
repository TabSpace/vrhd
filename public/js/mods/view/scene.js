/**
 * @fileoverview 场景视图
 * @authors
	Tony.Liang <pillar0514@gmail.com>
 * @description 显示3D场景的界面
 */
define('mods/view/scene',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $tpl = require('lib/kit/util/template');
	var $sceneModel = require('mods/model/scene');
	var $CoordinateSystem = require('mods/view/coordinateSystem');
	var $House = require('mods/view/house');
	var $personModel = require('mods/model/person');
	var $env = require('mods/ctrl/env');
	var $preload = require('mods/ctrl/preload');

	var TPL = $tpl({
		loading : [
			'<div class="logo-loading" data-role="loading">',
				'<div class="logo-box">',
					'<img src="images/logo/sina.png"/>',
				'</div>',
				'<div data-role="loading-info">',
					'<span data-role="loading-cur"></span>',
						' / ',
					'<span data-role="loading-all"></span>',
				'</div>',
			'</div>'
		]
	});

	var Scene = $view.extend({
		defaults : {
			name : 'scene',
			path : '',
			node : null,
			isSightDevice : false,
			type : 'front'
		},
		build : function(){
			var conf = this.conf;
			this.path = [conf.path, conf.name].join('.');
			this.model = new $sceneModel({
				type : conf.type
			});
			this.personModel = new $personModel();
			this.setPerspective();
			this.buildEnv();
			this.buildCoordinateSystem();
			this.setStyles();
			this.buildHouse();
			this.startPreload();
		},
		setEvents : function(action){
			this.delegate(action);
			var conf = this.conf;
			var model = this.model;
			var proxy = this.proxy();
			model.on('change:perspective', proxy('setPerspective'));
			model.on('change:perspectiveOrigin', proxy('setPerspective'));
		},
		setPerspective : function(){
			var model = this.model;
			this.role('root').css({
				'perspective' : model.get('perspective') + 'px',
				'perspective-origin' : model.get('perspectiveOrigin')
			});
		},
		//构建场景环境公共对象
		buildEnv : function(){
			this.env = new $env({
				scene : this
			});
		},
		startPreload : function(){
			$preload.start();
		},
		//构建空间坐标系
		buildCoordinateSystem : function(){
			var conf = this.conf;
			this.coordinateSystem = new $CoordinateSystem({
				path : this.path,
				env : this.env,
				isSightDevice : conf.isSightDevice,
				personModel : this.personModel,
				parent : this.role('root')
			});
		},
		//构建房间
		buildHouse : function(){
			this.house = new $House({
				path : this.path,
				env : this.env,
				personModel : this.personModel,
				coordinateSystem : this.coordinateSystem
			});
		},
		setStyles : function(){
			var conf = this.conf;
			if(conf.isSightDevice){return;}
			var root = this.role('root');
			var parent = root.parent();
			var width = root.width();
			var height = root.height();
			var size = Math.min(width, height);
			var scale = 1;
			if(size <= 300){
				scale = 1;
			}else{
				scale = size / 300;
				size = 300;
			}
			root.css({
				'position' : 'absolute',
				'top' : 0,
				'left' : 0,
				'bottom' : 0,
				'right' : 0,
				'margin' : 'auto',
				'width' : size + 'px',
				'height' : Math.floor(4 * size / 3) + 'px',
				'transform-origin' : '50% 50%',
				'transform' : 'rotateZ(-90deg) scale(' + scale + ')'
			});
			parent.css({
				'position' : 'absolute'
			});
		},
		//按照路径获取对象
		getObjByPath : function(path){
			path = path || '';
			if(path === this.path){
				return this;
			}else{
				var reg = new RegExp('^' + this.path + '\\.');
				var curPath = path.replace(reg, '');
				var arr = curPath.split('.');
				var obj = this;
				var name = '';
				while(arr.length && obj){
					name = arr.shift();
					if(obj.get){
						//surface将子对象存储在children对象，需用get方法获取
						obj = obj.get(name);
					}else{
						obj = obj[name];
					}
				}
				if(obj && obj.path === path){
					return obj;
				}
			}
		},
		update : function(data){
			data = data || {};
			if(this.personModel){
				this.personModel.set(data.person);
			}
			if(this.coordinateSystem){
				this.coordinateSystem.update(data.coordinateSystem);
			}
			if(this.house){
				this.house.update(data.house);
			}
		},
		toJSON : function(){
			var data = {};
			if(this.personModel){
				data.person = this.personModel.toJSON();
			}
			if(this.coordinateSystem){
				data.coordinateSystem = this.coordinateSystem.toJSON();
			}
			if(this.house){
				data.house = this.house.toJSON();
			}
			return data;
		}
	});

	module.exports = Scene;

});

