module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' + 
					'/*\n' + grunt.file.read('LICENSE') + '*/\n',
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js' 
			}
		},
		qunit: {
			all: ['test/*.html', 'test/**/*.html']
		}
	});

	// Load task libraries and register default task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.registerTask('default', ['uglify']);
}