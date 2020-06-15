const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const image = require('gulp-image');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const del = require('del');
const fonter = require('gulp-fonter');

const paths = {
    images: {
        src: 'app/images/*.*',
        dest: 'build/images'
    },
    font: {
        src: 'app/font/**/*.*',
        dest: 'build/font'
    },
    styles: {
        src: 'app/styles/**/*.scss',
        dest: 'build/css'
    },
    html: {
        src: 'app/**/*.html',
        dest: 'build/'
    }
};

function browser(done) {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    });
    done();
};

function browserReload(done) {
    browserSync.reload();
    done();
}
function images(){
    return gulp.src(paths.images.src)
        .pipe(image())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream())
}
function styles(){
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}
function font(){
    return gulp.src(paths.font.src)
        .pipe(fonter())
        .pipe(gulp.dest(paths.font.dest))
        .pipe(browserSync.stream())
} 

function html(){
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream())
}

function watch(){
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.font.src, font);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.html.src, html);
    gulp.watch('./app/*.html', gulp.series(browserReload));
}
function clear(){
    return del(['build']);
}
const build = gulp.series(clear, gulp.parallel(images, font, styles, html));

gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, gulp.series(build, browser)));