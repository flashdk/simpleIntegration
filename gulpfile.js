// Intialize module
const {src, dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
// var browserSync = require('browser-sync').create();
// const reload = browserSync.reload;

// File path variable
 const files = {
   scssPath: 'app/scss/**/*.scss',
   jsPath: 'app/js/**/*.js',
   images: 'app/images/*',
   html: 'app/*.html'
 }

// Sass task
function sccsTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('./app/'))
    .pipe(dest('app/dist')
  );
}

// Js task
function jsTask() {
  return src(files.jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('app/dist')
  );
}

// Cachebusting task
function cacheBustTask() {
  const cbString = new Date().getTime();
  return src(['app/index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('./app'))
}

// minify image task
function imageMinify() {  
  return src(files.images)
    .pipe(imagemin())
    .pipe(dest('app/dist/images'))
}

// Watch task
function watchTask() {
  watch([files.scssPath, files.jsPath],
    parallel(sccsTask, jsTask)
  );
}

// Default task
exports.default = series(
  parallel(sccsTask, jsTask, imageMinify),
  cacheBustTask,
  watchTask
);