'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var server = require('gulp-webserver');


/*gulp.task('minify', function () {
  return gulp.src
})*/


gulp.task('concat', function() {
  return gulp.src(['./src/kdsStepper.js', './src/kdsStepperController.js', './src/kdsStepperDirective.js'])
    .pipe(concat('kds-stepper.js'))
    .pipe(gulp.dest('.'));
});


gulp.task('compress', function() {
  return gulp.src('./kds-stepper.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('.'));
});


gulp.task('sass', function () {
  gulp.src('./src/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('kds-stepper.css'))
      .pipe(gulp.dest('./src'));
});


gulp.task('server', function () {
  gulp.src('./demo')
    .pipe(server({
      host: '0.0.0.0',
      port: 8077,
        directoryListing: true,
        open: true
    }))
});


gulp.task('default', ['sass', 'concat', 'compress', 'server'], function () {
  gulp.watch('./src/scss/*.scss', ['sass']);

  gulp.watch('./src/*.js', ['concat']);
});