var $fs = require('fs');
var $path = require('path');

var $lithe = require('lithe');
var $tool = $lithe.tool;
var $hfs = $lithe.hfs;

module.exports = function(grunt){

	var getOffsetPath = function(file, src){
		return file.replace(src, '').replace(/\\/gi, '\/');
	};

	grunt.registerMultiTask(
		'litheCompress',
		'compress files and deploy',
		function(){
			var done = this.async();

			var conf = this.options();
			var data = this.data;
			var srcPath = $path.join(conf.cwd, data.src);
			var destPath = $path.join(conf.cwd, data.dest);

			grunt.log.writeln('srcPath:', srcPath);
			grunt.log.writeln('destPath:', destPath);
			grunt.log.writeln('start compress ...');
			grunt.log.writeln();

			var compress = function(targetFiles, index, callback){
				var file = targetFiles.pop();
				var offsetPath;
				var destFile;
				if (file) {
					offsetPath = getOffsetPath(file, srcPath);
					destFile = $path.join(destPath, offsetPath);
					$tool.uglifyJs(file, destFile, function(){
						index++;
						grunt.log.writeln('%d [%s] compress completed.', index, offsetPath);
						compress(targetFiles, index, callback);
					});
				} else {
					callback(index);
				}
			};

			$hfs.walk(srcPath, function(files) {
				compress(files, 0, function(index){
					grunt.log.ok('all %d files compressed!', index);
					done();
				});
			});
		}
	);
};


