'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');


/*gulp.task('minify', function () {
  return gulp.src
})*/


gulp.task('concat', function() {
  return gulp.src('./src/*.js')
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
      .pipe(gulp.dest('./src'));
});

gulp.task('sass:watch', function () {
  gulp.src('./src/scss/*.scss', ['sass'])
});

gulp.task('default', ['sass', 'concat', 'compress'], function () {
  gulp.watch('./src/scss/*.scss', ['sass']);
});