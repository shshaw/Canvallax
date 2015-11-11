module.exports = function(grunt) {

  var globalConfig = {
        today: grunt.template.today("yyyy-mm-dd"),
        banner: '/*! <%= pkg.title %>, v<%= pkg.version %> (built <%= globalConfig.today %>) */'
      };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    globalConfig: globalConfig,
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {

    options: {
      sourceMap: true,
      //wrap: true,
      banner: globalConfig.banner,// + '\n(function(){ ',
      //footer: ' })();'
    },

    dist: {
      files: {
        'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.config('concat', {
    options: {
      banner: globalConfig.banner + '\n(function(){\n',
      footer: '\n\n})();',
      separator: '\n\n////////////////////////////////////////\n\n',
    },
    dist: {
      files: {
        'dist/<%= pkg.name %>.js': [
          'src/Canvallax.js',
          'src/Canvallax.Element.js',
          'src/Elements/*.js'
        ]
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

  grunt.registerTask('default', ['concat','uglify']);

};
