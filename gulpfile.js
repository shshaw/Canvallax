var gulp = require('gulp');
var rename = require('gulp-rename');

////////////////////////////////////////

var pkg = require('./package.json'),

    filename = pkg.name,

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
      dev: './dev',
      dist: './dist',
      docs: './docs'
    };

////////////////////////////////////////

var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');

gulp.task('default', function(){

  var argv = require('yargs').argv,
      destination = dest.dev,
      version = pkg.version,

      _filename = filename,

      flags = process.argv.slice(2),
      extra = [];

  // Remove 'watch' flag.
  var w = flags.indexOf('watch');
  if ( w > -1 ) { flags.splice(w,1); }

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

      _filename += '.custom';

      // Remove excluded files from src list.
      exclude.forEach(function(ex){
        src.unshift.apply(src,excludes[ex]);
      });
    }
  }

  var header = '/*! '+ pkg.name +' v'+ version +' ( built '+ today + ( extra.length ? ' ' + extra.join(', ') + ' ' : '') + ' ) '+ pkg.homepage +' @preserve */\n';

  return gulp.src(src)
    .pipe(concat(_filename+'.js',{
      sep: '\n\n////////////////////////////////////////\n\n'
    }))
      .pipe( concat.header(header) )
      .pipe( rename(_filename + '.js') )
      .pipe( gulp.dest(destination) )
    .pipe(uglify({ preserveComments: 'license' })
      .on('error', function(e){ console.log(e); }))
      .pipe( rename(_filename + '.min.js') )
      .pipe( gulp.dest(destination) );
});

////////////////////////////////////////

var jsdoc = require('gulp-jsdoc3');
var fs = require("fs");
var del = require("del");

gulp.task('docs', function (cb) {

    var config = require('./jsdoc/conf.json') || {};

    config.templates = config.templates || {};
    config.templates.systemName = pkg.title;

    return gulp.src(['README.md','dev/'+filename+'.js'], {read: false})
        .pipe(jsdoc(config,function(cb){
          // No way to configure jsdoc output directory, so we have to remove the existing ./docs folder, then rename the ./out dir
          cb = cb || function(e){ console.log(e);};
          del(dest.docs + '/**/*')
            .then(function(){
              fs.rename('./out',dest.docs,cb);
            });
        }))
});

////////////////////////////////////////

var runSequence = require('run-sequence');

gulp.task('full', function(){
  runSequence('default','docs');
})

gulp.task('watch', function(){
  return gulp.watch([src], ['full']);
});
