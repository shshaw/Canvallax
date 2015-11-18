module.exports = function(grunt) {

  var globalConfig = {
        today: grunt.template.today("yyyy-mm-dd"),
        banner: '/*! <%= pkg.title %>, v<%= pkg.version %> (built <%= globalConfig.today %>) <%= pkg.homepage %> @preserve */\n'
      };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    globalConfig: globalConfig,
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.config('concat', {
    options: {
      banner: globalConfig.banner + '(function(){\n\n',
      separator: '\n\n////////////////////////////////////////\n\n',
      footer: '\n\n})();',
    },
    dist: {
      files: {
        'dist/<%= pkg.title %>.js': [
          'src/Canvallax.js',
          'src/Canvallax.Element.js',
          'src/Elements/**/*.js',
          'src/Canvallax.Tracker.js',
          'src/Trackers/**/*.js'
        ]
      }
    },
    dev: {
      files: {
        'dev/<%= pkg.title %>.js': [
          'src/Canvallax.js',
          'src/Canvallax.Element.js',
          'src/Elements/**/*.js',
          'src/Canvallax.Tracker.js',
          'src/Trackers/**/*.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {

    options: {
      banner: globalConfig.banner
    },

    dist: {
      files: {
        'dist/<%= pkg.title %>.min.js': ['dist/<%= pkg.title %>.js']
      }
    },

    dev: {
      files: {
        'dev/<%= pkg.title %>.min.js': ['dev/<%= pkg.title %>.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.config('watch', {
    scripts: {
      files: 'src/**/*.js',
      tasks: ['uglify'],
      options: { debounceDelay: 250 },
    }
  });

  grunt.registerTask('default', ['concat:dist','uglify:dist']);
  grunt.registerTask('dev', ['concat:dev','uglify:dev']);

};
