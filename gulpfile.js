var gulp = require('gulp');
var rename = require('gulp-rename');

////////////////////////////////////////

var pkg = require('./package.json'),

    date = new Date(),
    today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate(),

    src = [
      'src/intro.js',
      'src/util.js',
      'src/core.js',
      'src/canvallax.Animate.js',
      'src/canvallax.Group.js',
      'src/canvallax.Scene.js',
      'src/canvallax.Element.js',
      'src/Elements/**/*.js',
      'src/canvallax.Tracker.js',
      'src/Trackers/**/*.js',
      'src/outro.js'
    ],

    excludes = {
      animate: [
        '!src/canvallax.Animate.js'
      ],
      elements: [
        '!src/Elements/**/*.js',
      ],
      trackers: [
        '!src/canvallax.Tracker.js',
        '!src/Trackers/**/*.js'
      ]
    },

    dest = {
      dev: 'dev',
      dist: 'dist'
    };

////////////////////////////////////////

var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');

gulp.task('default', function(){

  var argv = require('yargs').argv,
      destination = dest.dev,
      filename = pkg.name,
      version = pkg.version,

      flags = process.argv.slice(2),
      extra = [];

  if ( argv.dist ){
    destination = dest.dist;
  } else if ( !flags.length ) {
    version += 'dev';
  } else {
    version += 'custom';
    extra.push('flags: ' + flags.join(' '));

    if ( argv.exclude ) {
      var exclude = argv.exclude.split(',');
      console.log('Custom build excluding '+exclude.join(', '));

      filename += '.custom';

      // Remove excluded files from src list.
      exclude.forEach(function(ex){
        src.unshift.apply(src,excludes[ex]);
      });
    }
  }

  var header = '/*! '+ pkg.name +' v'+ version +' ( built '+ today + ( extra.length ? ' ' + extra.join(', ') + ' ' : '') + ' ) '+ pkg.homepage +' @preserve */\n';

  return gulp.src(src)
    .pipe(concat(filename+'.js',{
      sep: '\n\n////////////////////////////////////////\n\n'
    }))
    .pipe(uglify({
          mangle: false,
          compress: false,
          //preserveComments: 'license',
          output: {
            beautify: true,
            comments: true,
            indent_level: 2
          }
        })
        .on('error', function(e){ console.log(e); }))
    .pipe(concat.header(header))
    .pipe(gulp.dest(destination))
    .pipe(uglify({ preserveComments: 'license' })
        .on('error', function(e){ console.log(e); }))
    .pipe(rename(filename + '.min.js'))
    .pipe(gulp.dest(destination));
});

////////////////////////////////////////

gulp.task('watch', function(){ gulp.watch([src], ['default']); });
