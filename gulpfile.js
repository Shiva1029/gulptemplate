'use strict';

var gulp = require('gulp');

    var inject = require('gulp-inject');

    var sass = require('gulp-sass');
    var concat = require('gulp-concat');
    var minify = require('gulp-minify-css');

    var sassLint = require('gulp-sass-lint');

    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');

    var watch = require('gulp-watch');
    var batch = require('gulp-batch');


gulp.task('sass-lint', function () {
    gulp.src('./sass/*.s+(a|c)ss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

gulp.task('js-hint', function() {
    return gulp.src([ './js/*.*.js', './js/**/*.*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('inject-js-css', function () {
    var target = gulp.src('./app.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./js/*.module.js', './js/*.js'], {read: false});

    return target.pipe(inject(sources, {relative: true}))
        .pipe(gulp.dest('./'));
});

gulp.task('build-sass', function () {
    return gulp.src(['./sass/*.sass'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('cssfile.css'))
        .pipe(minify())
        .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
    watch(['./js/**/*.*.js', './sass/*.s+(a|c)ss'], batch(function (events, done) {
        gulp.start('js-hint', done);
        gulp.start('inject-js-css', done);
        gulp.start('build-sass', done);
    }));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['js-hint', 'inject-js-css', 'build-sass', 'watch']);
