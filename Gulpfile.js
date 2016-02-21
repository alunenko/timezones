var gulp        = require('gulp')
  , source      = require('vinyl-source-stream')
  , uglify      = require('gulp-uglify')
  , streamify   = require('gulp-streamify')
  , concat      = require('gulp-concat')
  , babel       = require('gulp-babel')
  , jade        = require('gulp-jade')
  , stylus      = require('gulp-stylus')
  , connect     = require('gulp-connect')
  , gnf         = require('gulp-npm-files')
  , gulpif      = require('gulp-if');
/*  , ngAnnotate  = require('gulp-ng-annotate')
  , browserify  = require('browserify')
  , gutil       = require('gulp-util');*/

var env = process.env.NODE_ENV || 'development';

var outputPath = 'builds/' + env;

gulp.task('jade', function() {
  return gulp.src( 'src/templates/**/*.jade' )
    .pipe( jade({
      pretty: env === 'development'
    }) )
    .pipe( gulp.dest(outputPath) )
    .pipe( connect.reload() );
});

gulp.task('css', function() {
  return gulp.src('src/styles/*.styl')
    .pipe( stylus({
      whitespace: true,
      compress: env === 'development'
    }) )
    .pipe( concat('css.min.css') )
    .pipe( gulp.dest(outputPath) )
    .pipe( connect.reload() );
});

gulp.task('babel', function() {
  return gulp.src('src/scripts/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('_tmp/scripts'))
  .pipe( connect.reload() );
});

gulp.task('js', ['babel', 'copyNpmDependenciesOnly'], function() {
  gulp.src( '_tmp/scripts/*.js' )
    .pipe( concat('all.min.js') )
    .pipe( gulpif(env === 'production', uglify()) )
    .pipe( gulp.dest(outputPath) )
    .pipe( connect.reload() );
});

gulp.task('copyNpmDependenciesOnly', function() {
  gulp.src(gnf(), {base:'./'})
  .pipe(gulp.dest(outputPath));
});

gulp.task('watch', function() {
  gulp.watch( 'src/styles/**/*.styl', ['css'] );
  gulp.watch( 'src/scripts/**/*.js', ['js'] );
  gulp.watch( 'src/templates/**/*.jade', ['jade'] );
});

gulp.task('connect', function() {
  connect.server({
    root: [outputPath],
    port: 3000,
    livereload: true
  })
});

gulp.task('default', ['js', 'css', 'jade', 'watch', 'connect']);
