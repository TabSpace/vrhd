var $fs = require('fs');
var $path = require('path');

var $lithe = require('lithe');
var $tool = $lithe.tool;
var $hfs = $lithe.hfs;

module.exports = function(grunt){

	var isJsFile = function(file) {
		return $path.extname(file).indexOf('.js') > - 1;
	};

	var getOffsetPath = function(file, src){
		return file.replace(src, '').replace(/\\/gi, '\/');
	};

	var getAlias = function(path){
		var file = $fs.readFileSync(path, 'utf-8');
		var match = (/\balias\s*:\s*(\{[^\{\}]+\})/).exec(file);
		var aliasStr = '';
		var alias = {};
		if(match && match[1]){
			aliasStr = match[1];
			alias = eval('(' + aliasStr +')');
		}
		return alias;
	};

	grunt.registerMultiTask(
		'litheConcat',
		'get requires and concat',
		function(){
			var done = this.async();

			var conf = this.options();
			var data = this.data;
			var filter = data.filter;
			var aliasPath = '';
			var srcPath = $path.join(conf.cwd, data.src);
			var destPath = $path.join(conf.cwd, data.dest);
			var targetPath = $path.join(conf.cwd, data.src, data.target);
			var globalPath = '';
			var withoutGlobal = data.withoutGlobal || [];

			var alias = {};
			var globalHash;

			if(data.alias){
				aliasPath = $path.join(conf.cwd, data.src, data.alias);
				alias = getAlias(aliasPath);
			}

			if(data.global){
				globalPath = $path.join(conf.cwd, data.src, data.global);
			}

			$tool.options.basepath = srcPath;
			$tool.options.alias = alias;

			grunt.log.writeln('alias:', alias);
			grunt.log.writeln('srcPath:', srcPath);
			grunt.log.writeln('destPath:', destPath);
			grunt.log.writeln('targetPath:', targetPath);
			grunt.log.writeln('globalPath:', globalPath);
			grunt.log.writeln();

			var concatFiles = [];

			if(filter === 'isJsFile'){
				filter = isJsFile;
			}else if(grunt.util.kindOf(filter) !== 'function'){
				filter = isJsFile;
			}

			var getGlobalHash = (function(){
				var hash;
				return function(){
					var requires;
					if(!hash){
						hash = {};
						if(globalPath){
							$tool.findJsAllrequires(globalPath).forEach(function(file){
								hash[getOffsetPath(file, srcPath)] = true;
							});
						}
					}
					return hash;
				};
			}());

			var getRequires = function(file, src){
				src = src || srcPath;
				var hash = getGlobalHash();
				var filePath = $path.join(src, file);
				var requires = [];

				if(file.indexOf('lithe.js') < 0){
					requires = $tool.findJsAllrequires(filePath).map(function(p){
						return getOffsetPath(p, src);
					});

					if (!withoutGlobal.every(function(wgp) {
						return file.indexOf(wgp) < 0;
					})) {
						requires = requires.filter(function(p) {
							return !hash[p];
						});
					}
				}

				requires.push(file);
				requires = requires.map(function(p){
					return $path.join(src, p);
				});

				return requires;
			};

			var runConcat = function(){
				var amount = 0;
				concatFiles.forEach(function(file, index){
					var destFilePath = $path.join(destPath, file);
					var requires = getRequires(file);
					$tool.concatFile(requires, destFilePath);
					grunt.log.writeln('%d [%s] concat completed.', index + 1, file);
					amount ++;
				});
				grunt.log.ok('all %d files concated!', amount);
				done();
			};

			if(data.walk){
				$hfs.walk(targetPath, function(files) {
					files = files.map(function(file){
						return getOffsetPath(file, srcPath);
					});
					concatFiles = concatFiles.concat(files);
					runConcat();
				},{
					filter: filter
				});
			}else{
				concatFiles = concatFiles.concat(
					$fs.readdirSync(targetPath)
						.filter(filter)
						.map(function(file){
							return getOffsetPath(file, srcPath);
						})
				);
				runConcat();
			}
		}
	);
};


