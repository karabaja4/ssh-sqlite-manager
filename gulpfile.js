var gulp = require('gulp'),
    less = require('gulp-less'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename');

gulp.task('watch', function () {
    gulp.watch('less/*.less', ['less']);
});

gulp.task('less', function () {
  return gulp.src('less/style.less')
    .pipe(less().on('error', function (err) {
        console.log(err);
    }))
    .pipe(cssmin().on('error', function(err) {
        console.log(err);
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('css/'));
});

gulp.task('default', ['less', 'watch']);