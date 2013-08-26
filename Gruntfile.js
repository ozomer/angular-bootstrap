// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function(grunt) {

  // Configurable paths
  var config = {
    connect: 9000 + 2,
    livereload: 35729 + 2,
    app: 'app',
    dist: 'dist'
  };

  // Livereload setup
  var lrSnippet = require('connect-livereload')({port: config.livereload});
  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cfg: config,
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.name %>\n' +
      ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      // ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n'
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= cfg.dist %>/*',
            '!<%= cfg.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      less: {
        files: ['<%= cfg.app %>/styles/**/*.less'],
        tasks: ['less:dist']
      },
      app: {
        files: [
          '<%= cfg.app %>/{,*/}*.html',
          '<%= cfg.app %>/views/{,*/}*.html',
          '{.tmp,<%= cfg.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= cfg.app %>}/scripts/{,*/}*.js',
          '{.tmp,<%= cfg.app %>}/bower_components/{,*/}/src/*.js',
          '<%= cfg.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: config.livereload
        }
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      }
    },
    connect: {
      options: {
        port: '<%= cfg.connect %>',
        hostname: '0.0.0.0' // Change this to '0.0.0.0' to access the server from outside.
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, config.app)
            ];
          }
        }
      }
    },
    less: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dev: {
        files: {
          '<%= cfg.app %>/styles/docs.css': '<%= cfg.app %>/styles/docs.less'
        }
      },
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          '<%= cfg.dist %>/styles/docs.min.css': '<%= cfg.app %>/styles/docs.less'
        }
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    // recess: {
    //   src: {
    //     src: ['<%= cfg.app %>/styles/main.less']
    //   }
    // },
    concat: {
      options: {
        banner: '<%= meta.banner %>',
        stripBanners: true
      },
      banner: {
        files: {
          // '<%= Object.keys(ngmin.dist.files)[0] %>': '<%= Object.keys(ngmin.dist.files)[0] %>',
          '<%= Object.keys(ngtemplates.dist.files)[0] %>': '<%= Object.keys(ngtemplates.dist.files)[0] %>',
          '<%= Object.keys(less.dev.files)[0] %>': '<%= Object.keys(less.dev.files)[0] %>',
          '<%= Object.keys(less.dist.files)[0] %>': '<%= Object.keys(less.dist.files)[0] %>'
        }
      },
      dist: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: '(function(window, document, undefined) {\n\'use strict\';\n',
          footer: '\n})(window, document);\n',
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },
        files: {
          '<%= cfg.dist %>/scripts/<%= pkg.name %>.js': [
            '<%= cfg.src %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    ngmin: {
      options: {
        banner: '<%= meta.banner %>',
        expand: true
      },
      dist: {
        files: {
          '<%= cfg.dist %>/scripts/<%= pkg.name %>.js': ['<%= cfg.dist %>/scripts/<%= pkg.name %>.js']
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= cfg.dist %>/scripts/<%= pkg.name %>.min.js': ['<%= Object.keys(ngmin.dist.files)[0] %>'],
          '<%= cfg.dist %>/scripts/templates.min.js': ['<%= Object.keys(ngtemplates.dist.files)[0] %>']
        }
      }
    },
    useminPrepare: {
      html: '<%= cfg.app %>/index.html',
      options: {
        dest: '<%= cfg.dist %>'
      }
    },
    usemin: {
      html: ['<%= cfg.dist %>/{,*/}*.html'],
      css: ['<%= cfg.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= cfg.dist %>']
      }
    },
    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= cfg.app %>',
          src: ['index.html'],
          dest: '<%= cfg.dist %>'
        }]
      }
    },
    ngtemplates: {
      options: {
        module: 'docs',
        base: '<%= cfg.app %>/'
      },
      dist: {
        files: {
          '<%= cfg.dist %>/scripts/templates.js': [
            '<%= cfg.app %>/views/{,*/}*.html'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= cfg.app %>',
          dest: '<%= cfg.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{png,jpg,jpeg}',
            'styles/fonts/*'
          ]
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= cfg.dist %>/scripts/{,*/}*.js',
            '<%= cfg.dist %>/styles/{,*/}*.css'
            // '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            // '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    }
  });

  grunt.registerTask('server', [
    'clean:server',
    'connect:livereload',
    'open:server',
    'watch'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'karma:unit'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    // 'useminPrepare',
    'less',
    'htmlmin:dist',
    'concat:dist',
    'ngmin:dist',
    'ngtemplates:dist',
    'uglify:dist',
    'concat:banner',
    // 'copy:dist',
    'rev:dist',
    'usemin'
  ]);

  // grunt.registerTask('release', [
  //   'test',
  //   'bump-only',
  //   'dist',
  //   'bump-commit'
  // ]);

  grunt.registerTask('build', ['dist']);
  grunt.registerTask('default', ['dist']);

};
