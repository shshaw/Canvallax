var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

////////////////////////////////////////

var pkg = require('./package.json'),

    today = new Date().toISOString().split('T')[0],

    src = ['src/**/*.js'],
    filename = pkg.name,

    dest = {
      dev: './dev',
      dist: './dist',
      docs: './docs'
    };

////////////////////////////////////////

gulp.task('lint', function() {
  return gulp.src(src)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

////////////////////////////////////////

gulp.task('build', function () {

  var _filename = filename,
      destination = dest.dev,
      context = {
        version: pkg.version,
        exclude: {}
      },

      argv = require('yargs').argv,
      extra = [];

  if ( argv.dist ){
    destination = dest.dist;
  } else if ( argv.exclude && argv.exclude.length ) {
    extra.push('--exclude='+argv.exclude);
    context.version += 'custom';
    _filename += '.custom';

    exclude = argv.exclude.split(',');
    exclude.forEach(function(ex){
      context.exclude[ex] = true;
    });
  } else {
    context.version += 'dev';
  }

  context.header = '/*! '+ pkg.name +' v'+ context.version +' ( built '+ today + ( extra.length ? ' ' + extra.join(', ') + ' ' : '') + ' ) '+ pkg.homepage +' @preserve */\n';

  return gulp.src('./src/canvallax.js')
    .pipe(
        $.preprocess({ context: context })
          .on('error', function(e){ console.log(e); })
      )
      .pipe( $.rename(_filename + '.js') )
      .pipe( gulp.dest(destination) )
    .pipe(
        $.uglify({ preserveComments: 'license' })
          .on('error', function(e){ console.log(e); })
      )
      .pipe( $.rename(_filename + '.min.js') )
      .pipe( $.size({ showFiles: true }) )
      .pipe( $.size({ showFiles: true, gzip: true }) )
      .pipe( gulp.dest(destination) );
});

////////////////////////////////////////

var fs = require("fs");
var del = require("del");

gulp.task('docs', function (cb) {

    var config = require('./jsdoc.json') || {};

    config.templates = config.templates || {};
    config.templates.systemName = pkg.title;

    return gulp.src(['README.md','dist/'+filename+'.js'], {read: false})
        .pipe($.jsdoc3(config,function(cb){
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

gulp.task('default', function(){
  runSequence('lint','build','docs');
})

gulp.task('watch', function(){
  return gulp.watch(src, ['lint','build']);
});
