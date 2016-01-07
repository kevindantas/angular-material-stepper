'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./src/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./src'));
});

gulp.task('sass:watch', function () {
  gulp.src('./src/scss/*.scss', ['sass'])
});

gulp.task('default', ['sass'], function () {
  gulp.watch('./src/scss/*.scss', ['sass']);
});