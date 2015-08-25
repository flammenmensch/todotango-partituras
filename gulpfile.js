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

gulp.task('js', function() {
  return browserify({ entries: [ 'client/index.js' ] })
    .transform(babelify)
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(eslint())
    .pipe(gulp.dest('./public'));
});

gulp.task('build', [ 'js' ]);

gulp.task('watch', function() {
  gulp.watch([ 'client/**/*.js' ], [ 'js' ]);
});

gulp.task('default', [ 'watch' ]);
