"use strict";

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    qunit: {
      files: ['test/client/**/*.html']
    },
    concat: {
      dist: {
        src: ['public/lib/**/*.js', 'public/js/**/*.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'public/dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    watch: {
      files: ['lib/**/*.js', 'test/**/*.js', 'src/**/*.js', 'public/js/**/*.js'],
      tasks: 'jshint simplemocha:client'
    },
    jshint: {
      grunt: ['grunt.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {},
      server: {
        files: {
          src: ['test/**/*.js', 'src/*.js', 'src/lib/**/*.js', 'src/api/**/*.js', 'src/views/**/*.js']
        },
        options: {
          node: true,
          predef: [
            // MOCHA
            "describe",
            "it",
            // PHANTOMJS
            "document"
          ]
        }
      },
      client: {
        files: {
          src: ['src/app/js/**/*.js']
        },
        options: {
          browser: true,
          globals: {"define": true,
                    "google": false,
                    "window": false,
                    "d3": false,
                    "_": false}
        }
      }
    },
    casperjs: {
      files: ['test/functional/**/*.js']
    },
    uglify: {},
    simplemocha: {
      node: {
        src: 'test/server/**/*.spec.js',
        options: {
          globals: ['should'],
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'nyan'
        }
      },
      functional: {
        src: 'test/functional/**/*.spec.js',
        options: {
          globals: ['should'],
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'nyan'
        }
      },
      client: {
        src: 'test/client/**/*.spec.js',
        options: {
          reporter: 'nyan'
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          mainConfigFile: 'src/app/requirejs.config.js',
          // this paths config must be here, otherwise almond won't work
          paths: {

          },
          almond: true,
          insertRequire: ['main'],
          dir: 'public/dist',
          appDir: 'src/app',
          inlineText: true,
          modules: [{
            name: 'main'
          }],
          deps: [ 'backbone.marionette.handlebars' ],
          hbs: {
            templateExtension: 'hbs'
          },
          pragmas: {
            doExclude: true
          },
          pragmasOnSave: {
            //removes Handlebars.Parser code (used to compile template strings) set
            //it to `false` if you need to parse template strings even after build
            excludeHbsParser : true,
            // kills the entire plugin set once it's built.
            excludeHbs: true,
            // removes i18n precompiler, handlebars and json2
            excludeAfterBuild: true
          }
        }
      }
    },
    shell: {
      git_checkout_new_branch: {
        command: 'git checkout -B deploy',
        stdout: true
      },
      rm_gitmodules: {
        command: 'git rm .gitmodules',
        stdout: true
      },
      git_add_dist: {
        command: 'git add public/dist',
        stdout: true
      },
      git_commit_new_rel: {
        command: 'git commit -m \'Automated deployment via grunt\'',
        stdout: true
      },
      git_push_to_heroku: {
        command: 'git push heroku deploy:master -f -v',
        stdout: true,
        stderr: true
      },
      git_checkout_master: {
        command: 'git checkout master',
        stdout: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'functional', 'requirejs']);

  grunt.registerTask('deploy', ['functional', 'requirejs', 'shell']);

  grunt.registerTask('mocha', 'simplemocha');

  grunt.registerTask('run', ['jshint', 'qunit', 'functional', 'concat', 'min', 'start']);

  grunt.registerTask('test', ['jshint', 'functional']);

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.loadNpmTasks('grunt-requirejs');

  grunt.loadNpmTasks('grunt-shell');

  grunt.loadTasks('tasks');

};
