var del = require('del'),
  gulp = require('gulp'),
  path = require('path'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  jshintJsx = require('jshint-jsx'),
  jshintStylish = require('jshint-stylish'),
  rename = require('gulp-rename');

var assetsPath = path.join('public');
var scriptPath = path.join('app', '**', '*.js');

console.log(path.join('app', 'app.js'));

gulp
  .task('clean', function(cb) {
    return del([assetsPath], cb);
  })
  .task('jshint', ['clean'], function() {
    return gulp.src([scriptPath])
      .pipe(jshint({
        linter: jshintJsx.JSXHINT,
        esnext: true
      }))
      .pipe(jshint.reporter(jshintStylish))
      .pipe(jshint.reporter("fail"));
  })
  .task('minify-js', ['build-js'], function() {
    return gulp.src([path.join(assetsPath, 'js', '*.js')])
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(uglify())
      .pipe(gulp.dest(path.join(assetsPath, 'js')));
  })
  .task('build-js', ['jshint'], function() {
    return browserify(['./app/app.js'])
      .transform(babelify)
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest(path.join(assetsPath, 'js')));
  })
  .task('watch', function() {
    gulp.watch(scriptPath, ['minify-js']);
  })
  .task('default', ['minify-js']);