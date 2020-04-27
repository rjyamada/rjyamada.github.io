'use strinct';

module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });
    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'src/css/styles.css': 'src/scss/styles.scss',
                    'src/css/print.css': 'src/scss/print.scss'
                }
            }
        },
        watch: {
            files: 'src/scss/*.scss',
            tasks: ['sass']
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'src/css/*.css',
                        'src/*.html',
                        'src/js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './',
                        index: "src/index.html"
                    }
                }
            }
        },
        copy: {
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'src/',
                    src: ['*.html'],
                    dest: './'
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'node_modules/font-awesome',
                    src: ['fonts/*.*'],
                    dest: './'
                }]
            }
        },
        clean: {
            build: {
                src: ['css/','img/','fonts/','js/','*.html', 'src/css']
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'src/',
                    src: ['img/*.{png,jpg,gif}'],
                    dest: './'
                }]
            }
        },
        useminPrepare: {
            foo: {
                src: ['index.html'],
                dest: './'
            },
            options: {
                dest: './',
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js: ['uglify']
                    },
                    post: {
                        css: [{
                            name: 'cssmin',
                            createConfig: function (context, block) {
                                var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0, rebase: false
                                };
                            }
                        }]
                    }
                }
            }
        },

        // Concat
        concat: {
            options: {
                separator: ';'
            },

            // dist configuration is provided by useminPrepare
            dist: {}
        },

        // Uglify
        uglify: {
            // dist configuration is provided by useminPrepare
            dist: {}
        },

        cssmin: {
            css: {}
        },

        // Filerev
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },

            release: {
                // filerev:release hashes(md5) all assets (images, js and css )
                // in dist directory
                files: [{
                    src: [
                        'js/*.js',
                        'css/*.css',
                    ]
                }]
            }
        },

        // Usemin
        // Replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets
        // according to their relative paths
        usemin: {
            html: ['index.html'],
            options: {
                assetsDirs: ['./', 'css', 'js']
            }
        },

        htmlmin: {                                         // Task
            dist: {                                        // Target
                options: {                                 // Target options
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'index.html': 'index.html'         // 'destination': 'source'
                }
            }
        }
    });
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('default', ['browserSync', 'sass', 'watch']);
    grunt.registerTask('build', ['clean', 'sass', 'copy', 'imagemin', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'filerev', 'usemin', 'htmlmin']);

}
