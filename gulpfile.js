
'use strict';

let fs = require('fs'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    notify      = require('gulp-notify'),
    browserSync = require('browser-sync').create(),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    cssmin  = require('gulp-cssmin'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat');


let paths = {
    html:['./*.html'],
    css:['./scss/**/*.scss'],
    js: '/js/**/*.js',
    dest: './assets'
};

let isProd = gutil.env.env == 'production';


gulp.task('sass', function () {

    gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(isProd ? autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }) : gutil.noop())
        .pipe(isProd ? gutil.noop() : sourcemaps.write('../css'))
        .pipe(isProd ? cssmin({ compatibility: '*',
            level: {
                2: {
                    all: false,
                    removeDuplicateRules: true
                }
            }
        }) : gutil.noop())
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(isProd ? uglify({
            mangle: true
        }) : gutil.noop())
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
});


gulp.task('serve', function() {

    browserSync.init({
        server: "./",
        port: 8080
    });

    gulp.watch(paths.css, ['sass']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.html).on('change', browserSync.reload);
});


gulp.task('default', ['serve']);

gulp.task('build', ['sass','js']);