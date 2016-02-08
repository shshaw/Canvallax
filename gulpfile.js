var gulp = require('gulp');
var rename = require('gulp-rename');

////////////////////////////////////////

var pkg = require('./package.json'),
    date = new Date(),
    today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

var files = [
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
    dirs = {
      dev: 'dev',
      dist: 'dist',
      custom: 'custom'
    };

////////////////////////////////////////


var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');

gulp.task('default', function(){

  var argv = require('yargs').argv;

  var destination = dirs.dev,
      filename = pkg.name,
      extra = '';

  if ( argv.dist ){
    destination = dirs.dist;
  } else {
    pkg.version += 'dev';
  }

  if ( argv.exclude ) {
    //destination = dirs.custom;

    var exclude = argv.exclude.split(',');
    console.log('Custom build excluding '+exclude.join(', '));

    extra = ', custom build flags: --exclude='+argv.exclude;

    filename += '.custom';

    exclude.forEach(function(ex){
      files.unshift.apply(files,excludes[ex]);
    });
  }

  var header = '/*! '+ pkg.name +' v'+ pkg.version +' (built '+ today + ( extra ? extra : '') + ') '+ pkg.homepage +' @preserve */\n',
    separator = '\n\n////////////////////////////////////////\n\n';

  return gulp.src(files)
    .pipe(concat(filename+'.js',{ sep: separator }))
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


gulp.task('watch', function(){
  gulp.watch([files], ['default']);
});

/*
////////////////////////////////////////

var rename = require('gulp-rename');
var foreach = require('gulp-foreach');
var path = require('path');

var handlebars = require('gulp-static-handlebars');
var Handlebars = handlebars.instance();

function makeTitle(slug) {
    var words = slug.split('-');

    for(var i = 0; i < words.length; i++) {
      var word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(' ');
}

gulp.task('pages', function(){

  return gulp.src(files.pages)
    .pipe(foreach(function(stream, file){

      var filename = path.basename(file.path),
            //file.path.replace(file.base,"");
          title = makeTitle(
            filename.replace(path.extname(filename),"")
          ),
          data = {
            pkg: pkg,
            filename: filename,
            title: ( title === 'Index' ? false : title )
          },
          pageContents = Handlebars.compile(file.contents.toString('utf8'));

          data.page = pageContents(data);

      return gulp.src(files.template)
          .pipe(
            handlebars(data,{
              partials: gulp.src(files.templates)
            })
          )
          .pipe(rename(filename));
    }))
    .pipe(gulp.dest(dirs.build));


});

*/
////////////////////////////////////////

/*
var runSequence = require('run-sequence');

gulp.task('default',function(callback){
  runSequence('icons','pages',callback);
});

gulp.task('watch', function() {
  gulp.watch([files.pages,files.templates], ['pages']);
  gulp.watch([files.icons], ['default']);
});
*/
