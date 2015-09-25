"use strict";

var gulp = require('gulp');
var reactify = require('reactify');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var eslint = require('gulp-eslint');
var runSequence = require('run-sequence');
var del = require('del');
var sass = require('gulp-sass');

gulp.task('js', function() {
  return browserify({ entries: [ 'client/index.js' ] })
    .transform(babelify.configure({ optional: [ 'es7.objectRestSpread' ] }))
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(eslint())
    .pipe(gulp.dest('./public'));
});

gulp.task('css', function() {
  return gulp.src('sass/all.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public'));
});

gulp.task('build', [ 'js', 'css' ]);

gulp.task('watch', function() {
  gulp.watch([ 'client/**/*.js' ], [ 'js' ]);
  gulp.watch([ 'sass/**/*.scss' ], [ 'css' ]);
});

gulp.task('default', [ 'watch' ]);
