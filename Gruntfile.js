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
            css: {
                files: 'src/scss/*.scss',
                tasks: ['sass']
            },
            image: {
                files: 'src/img/*.{png,jpg,gif,ico}',
                tasks: ['imagemin','cwebp']
            }
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
                src: ['css/', 'img/', 'fonts/', 'js/', '*.html', 'sw.js','src/css']
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'src/',
                    src: ['img/*.{png,jpg,gif,ico}'],
                    dest: './'
                }]
            }
        },
        cwebp: {
            dynamic: {
                options: {
                    q: 90
                },
                files: [{
                    expand: true,
                    cwd: './',
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
            dist: {},
            sw:{
                files: {
                    'sw.js': ['src/js/sw.js']
                  }
            }
        },

        uncss: {
            dist: {
                files: {
                    'css/main.css': ['index.html']
                }
            }
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
                        'js/main.js',
                        'css/main.css',
                        'css/print.css',
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
            js: 'sw.js',
            options: {
                assetsDirs: ['./', 'css', 'js'],
                patterns: {
                    js: [
                      [/(main\.js)/], [/(main\.css)/], [/(print\.css)/]
                    ]
                  }
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
    grunt.registerTask('default', ['browserSync', 'sass', 'imagemin','cwebp', 'watch']);
    grunt.registerTask('build', ['clean', 'sass', 'copy', 'imagemin', 'cwebp', 'useminPrepare', 'concat', 'cssmin', 'uncss', 'uglify', 'filerev', 'usemin', 'htmlmin']);

}
