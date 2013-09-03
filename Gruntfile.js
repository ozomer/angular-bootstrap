'use strict';

module.exports = function(grunt) {

  // Configurable paths
  var config = {
    src: 'src',
    test: 'test',
    dist: 'dist'
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
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= cfg.dist %>/*'
          ]
        }]
      },
      server: '.tmp'
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
          jshintrc: '.jshintrc'
        },
        src: ['<%= cfg.src %>/{,*/}*.js']
      },
      test: {
        options: {
          jshintrc: '<%= cfg.test %>/.jshintrc'
        },
        src: ['<%= cfg.test %>/{,*/}*.js']
      }
    },
    karma: {
      options: {
        configFile: '<%= cfg.test %>/karma.conf.js'
        // browsers: ['PhantomJS']
      },
      unit: {
        singleRun: true
      },
      watch: {
        autoWatch: true
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>',
        stripBanners: true
      },
      banner: {
        files: {
          '<%= Object.keys(ngmin.dist.files)[0] %>': '<%= Object.keys(ngmin.dist.files)[0] %>',
          // '<%= Object.keys(ngtemplates.dist.files)[0] %>': '<%= Object.keys(ngtemplates.dist.files)[0] %>',
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
          '<%= cfg.dist %>/<%= pkg.name %>.js': [
            '<%= cfg.src %>/{,*/}*.js'
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
          '<%= cfg.dist %>/<%= pkg.name %>.js': ['<%= cfg.dist %>/<%= pkg.name %>.js']
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= cfg.dist %>/<%= pkg.name %>.min.js': ['<%= Object.keys(ngmin.dist.files)[0] %>'],
          // '<%= cfg.dist %>/scripts/templates.min.js': ['<%= Object.keys(ngtemplates.dist.files)[0] %>']
        }
      }
    }
  });

  grunt.registerTask('test', [
    'jshint',
    'karma:unit'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    // 'less',
    'concat:dist',
    'ngmin:dist',
    'uglify:dist',
    'concat:banner'
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
