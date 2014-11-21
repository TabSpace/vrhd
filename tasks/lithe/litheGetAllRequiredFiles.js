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
		if(match && match[1]){
			aliasStr = match[1];
		}
		var alias = eval('(' + aliasStr +')');
		return alias;
	};

	grunt.registerMultiTask(
		'litheGetAllRequiredFiles',
		'get all require files and copy to target directory',
		function(){
			var done = this.async();
			var conf = this.options();
			var data = this.data;
			var filter = data.filter;

			var aliasPath = '';
			var srcPath = $path.join(conf.cwd, data.src);
			var destPath = $path.join(conf.cwd, data.dest);
			var targetPath = $path.join(conf.cwd, data.src, data.target);
			var alias = {};
			var requireHash = {};
			var processFiles = [];

			if(data.alias){
				aliasPath = $path.join(conf.cwd, data.src, data.alias);
				alias = getAlias(aliasPath);
			}

			$tool.options.basepath = srcPath;
			$tool.options.alias = alias;

			grunt.log.writeln('alias:', alias);
			grunt.log.writeln('srcPath:', srcPath);
			grunt.log.writeln('destPath:', destPath);
			grunt.log.writeln('targetPath:', targetPath);
			grunt.log.writeln();

			if(filter === 'isJsFile'){
				filter = isJsFile;
			}else if(grunt.util.kindOf(filter) !== 'function'){
				filter = isJsFile;
			}

			var getRequires = function(){
				processFiles.forEach(function(file, index){
					var filePath = $path.join(srcPath, file);
					var requires = $tool.findJsAllrequires(filePath).map(function(p){
						return getOffsetPath(p, srcPath);
					});
					requires.forEach(function(offset){
						requireHash[offset] = true;
					});
					grunt.log.writeln('%d [%s] get requires completed.', index + 1, file);
				});
				
				var requiredFiles = Object.keys(requireHash);
				requiredFiles.forEach(function(file, index){
					var srcFilePath = srcPath + file;
					var destFilePath = destPath + file;
					grunt.file.copy(srcFilePath, destFilePath);
					grunt.log.writeln('%d [%s] copied to %s .', index + 1, file, data.dest);
				});

				grunt.log.ok('all d% required files were copied to %s !', requiredFiles.length, data.dest);
				done();
			};

			grunt.file.delete(destPath);

			$hfs.walk(targetPath, function(files) {
				files = files.map(function(file){
					return getOffsetPath(file, srcPath);
				});
				processFiles = processFiles.concat(files);
				getRequires();
			},{
				filter: filter
			});

		}
	);
};


