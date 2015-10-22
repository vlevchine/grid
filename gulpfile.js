/**
 * Created by Vlad on 2015-10-21.
 */
'use strict';
var gulp = require('gulp'),
    karmaServer = require('karma').Server,
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso');

var config = {
    karma: {
        configFile: __dirname + '\\karma.conf.js',
        singleRun: true
    },
    vendorJS: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/lodash/lodash.min.js'
    ],
    vendorCSS: [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
        'bower_components/font-awesome/css/font-awesome.min.css'
    ],
    fonts: [
        'bower_components/bootstrap/dist/fonts/*.*',
        'bower_components/font-awesome/fonts/*.*'],
    server: [
        'src/server/*.*']
};

gulp.task('jshint', function() {
   return gulp.src('src/**/*.js')
       .pipe(jshint())
       .pipe(jshint.reporter('jshint-stylish', {verbose: true}));
});

gulp.task('sass', function() {
    return gulp.src('src/styles/app.scss')
        .pipe(sass())
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('src/styles'));
});

gulp.task('test', function(done) {
    new karmaServer(config.karma, done)
        .start();
});

gulp.task('serve', ['watch'], function() {
    browserSync({
        server: {
            baseDir: './src'
        }
    });
});

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('watch', function() {
    gulp.watch('src/styles/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', ['reload']);
    gulp.watch('src/scripts/**/*.js', ['reload']);
});

gulp.task('vendorJS', [], function () {
    return gulp.src(config.vendorJS)
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest('./dist/js'));
});
gulp.task('vendorCSS', [], function () {
    return gulp.src(config.vendorCSS)
        .pipe(concat("bundle.css"))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('fonts', function() {
    return gulp
        .src(config.fonts)//'./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,woff2,eot,eof,svg}'
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('server', function() {
    return gulp
        .src(config.server)//
        .pipe(gulp.dest('./dist/'));
});

gulp.task('css', ['sass'], function() {
    return gulp.src('src/styles/app.css')
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('js', function() {
    console.log('no js files yet')
});

gulp.task('assets', ['vendorJS', 'fonts', 'vendorCSS']);
gulp.task('build', ['css', 'server', 'js']);
gulp.task('default', ['serve']);
