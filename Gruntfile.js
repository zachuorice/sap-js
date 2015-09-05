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
        cssmin: {
            target: {
                files: {
                    'build/<%= pkg.name %>.min.css':['src/<%= pkg.name %>.css']
                }
            }
        },
		qunit: {
			all: ['test/*.html', 'test/**/*.html']
		}
	});

	// Load task libraries and register default task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', ['uglify', 'cssmin']);
}
