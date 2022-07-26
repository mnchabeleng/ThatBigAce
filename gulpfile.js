const gulp = require('gulp')
const ejs = require('gulp-ejs')
const htmlbeautify = require('gulp-html-beautify')
const minifyInline = require('gulp-minify-inline')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const cmq = require('gulp-combine-media-queries')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const replace = require('gulp-replace')
const browserSync = require('browser-sync').create()

const src = './src'
const dist = './dist'

// EJS Task
exports.ejs  = () => {
    return gulp.src(src + '/*.ejs')
    .pipe(ejs())
    .pipe(htmlbeautify())
    .pipe(rename({ extname: '.html' }))
    .pipe(minifyInline())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
}

// Sass Task
exports.scss = () => {
    return gulp.src(src + '/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist + '/css'))
    .pipe(browserSync.stream())
}

// JS Task
exports.js = () => {
    return gulp.src([
        src + '/vendor/jquery.min.js',
        src + '/vendor/scrollwatch.js',
        src + '/vendor/jquery.magnific-popup.min.js',
        src + '/vendor/aos.min.js',
        src + '/js/**/*.js'
    ])
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist + '/js'))
    .pipe(browserSync.stream())
}

// Images Task
exports.img = () => {
    return gulp.src(src + '/img/**/*')
    .pipe(gulp.dest(dist + '/img'))
    .pipe(browserSync.stream())
}

// Mail Server Task
exports.mail = () => {
    return gulp.src('./mail/**/*')
    .pipe(gulp.dest(dist + '/mail'))
    .pipe(browserSync.stream())
}

// Cachebusting Task
exports.cb = () => {
    return gulp.src(dist + '/*.html')
    .pipe(replace(/ver=\d+/g, 'ver=' + new Date().getTime()))
    .pipe(gulp.dest(dist))
}

// Browser-sync Task
exports.bs = () => {
    browserSync.init({
        server: {
            baseDir: dist,
            open: false,
            notify: false
        }
    })
}

// Watch Task
exports.watch = () => {
    this.bs()
    gulp.watch([src], gulp.parallel(this.ejs, this.scss, this.js, this.img))
}

// Default Task
exports.default = gulp.series(this.ejs, this.scss, this.js, this.img, this.mail, this.cb)
