var $path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		localBase : $path.resolve(__dirname),
		pkg: grunt.file.readJSON('package.json'),
		litheConcat : {
			options : {
				cwd: '<%=localBase%>'
			},
			publish : {
				src : 'public/js/',
				dest : 'public/js/dist/',
				walk : true,
				alias : 'config.js',
				global : 'conf/global.js',
				withoutGlobal : [

				],
				target : 'conf/'
			}
		},
		litheCompress : {
			options : {
				cwd: '<%=localBase%>'
			},
			publish : {
				src : 'public/js/dist/',
				dest : 'public/js/dist/'
			}
		}
	});

	grunt.loadTasks('tasks/lithe');

	grunt.registerTask(
		'publish',
		'[COMMON] pack and compress files, then distribute',
		[
			'litheConcat:publish',
			'litheCompress:publish'
		]
	);

	grunt.registerTask(
		'default',
		'the default task is publish',
		[
			'publish'
		]
	);
};


