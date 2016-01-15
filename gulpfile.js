var gulp = require('gulp');
var rename = require('gulp-rename');

////////////////////////////////////////

var pkg = require('./package.json'),
    date = new Date(),
    today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

var files = [
          'src/util.js',
          'src/Core.js',
          'src/Canvallax.js',
          'src/Canvallax.Element.js',
          'src/Elements/**/*.js',
          'src/Canvallax.Tracker.js',
          'src/Trackers/**/*.js'
        ],
    dirs = {
      dev: 'dev',
      dist: 'dist'
    };

////////////////////////////////////////


var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');

var header = '/*! '+ pkg.title +', v'+ pkg.version +' (built '+ today +') '+ pkg.homepage +' @preserve */\n' +
    '(function(){\n\n  \'use strict\';\n\n',
    separator = '\n\n////////////////////////////////////////\n\n',
    footer = '\n\n})();';

gulp.task('default', function(){

  var destination = dirs.dist;
  //console.log(process.argv);

  if (process.argv.indexOf('--dev') > -1){
    destination = dirs.dev;
  }

  return gulp.src(files)
    .pipe(concat(pkg.title + '.js',{ sep: separator }))
    .pipe(concat.header(header))
    .pipe(concat.footer(footer))
/*
    .pipe(uglify({
          compress: false,
          preserveComments: 'license'
        })
        .on('error', function(e){ console.log(e); }))
*/
    .pipe(gulp.dest(destination))
    .pipe(uglify({ preserveComments: 'license' })
        .on('error', function(e){ console.log(e); }))
    .pipe(rename(pkg.title + '.min.js'))
    .pipe(gulp.dest(destination));
});


gulp.task('watch', function() {
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
