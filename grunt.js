module.exports = function(grunt) {
	grunt.initConfig({
		coffee: {
			app: {
				src: 'assets/coffee/*.coffee',
				dest: 'assets/js',
				options: {
					bare: true
				}
			}
		},
		compass: {
			dev: {
				src: 'assets/scss',
				dest: 'assets/css',
				linecomments: true,
				forcecompile: true,
				require: 'animation',
				debugsass: true,
				images: 'assets/img',
				relativeassets: false
			},
			prod: {
				src: 'assets/scss',
				dest: 'assets/css',
				outputstyle: 'compressed',
				linecomments: false,
				forcecompile: true,
				require: 'animation',
				debugsass: false,
				images: 'assets/img',
				relativeassets: false
			}
		},
		watch: {
			scss: {
				files: ['assets/scss/*.scss'],
				tasks: 'compass:dev'
			},
			coffee: {
				files: ['assets/coffee/*.coffee'],
				tasks: 'coffee:app'
			}
		}
	});

	grunt.loadNpmTasks('grunt-compass');
	grunt.loadNpmTasks('grunt-coffee');
};