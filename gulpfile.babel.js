import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import pump from 'pump';
import cssnano from 'gulp-cssnano';
import htmlmin from 'gulp-htmlmin';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import del from 'del';
import {create as bsCreate} from 'browser-sync';
const browserSync = bsCreate();

const paths = {
  allSrcJS: 'src/js/**/*.js',
  allSrcCSS: 'src/css/**/*.css',
  allSrcHTML: 'src/**/*.html',
  allSrcIMG: 'src/images/**/*.{jpg,png,gif,jpeg,svg}',
  distJS: 'dist/js',
  distCSS: 'dist/css',
  distHTML: 'dist',
  distIMG: 'dist/images',
  watchFiles: [ 'dist/*.html', 'dist/css/*.css', 'dist/js/*.js', 'dist/images/*.png', 'dist/images/*.jpg', 'dist/images/*.gif', 'dist/images/*.svg' ],
};
gulp.task('browser-sync', () => {
  browserSync.init({
    files: paths.watchFiles,
    server: {
      baseDir: paths.distHTML
    }
  });
});
gulp.task('cleanHTML', () => {
  return del(paths.distHTML + '/*.html');
});
gulp.task('cleanJS', () => {
  return del(paths.distJS);
});
gulp.task('cleanCSS', () => {
  return del(paths.distCSS);
});
gulp.task('cleanIMG', () => {
  return del(paths.distIMG);
});
gulp.task('buildJS', ['cleanJS'], () => {
  return pump([
    gulp.src(paths.allSrcJS),
    uglify(),
    rename({
      extname: ".min.js"
    }),
    gulp.dest(paths.distJS)
  ]);
});
gulp.task('buildHTML', ['cleanHTML'], () => {
  return pump([
    gulp.src(paths.allSrcHTML),
    htmlmin({collapseWhitespace: true}),
    gulp.dest(paths.distHTML)
  ]);
});
gulp.task('buildCSS', ['cleanCSS'], () => {
  return pump([
        gulp.src(paths.allSrcCSS),
        cssnano(),
        rename({
            extname: ".min.css"
        }),
        gulp.dest(paths.distCSS)
    ]);
});
gulp.task('buildIMG', ['cleanIMG'], () => {
  return pump([
    gulp.src(paths.allSrcIMG),
    imagemin(),
    gulp.dest(paths.distIMG)
  ]);
});
gulp.task('watch', () => {
  gulp.watch(paths.allSrcJS, ['buildJS']);
  gulp.watch(paths.allSrcHTML, ['buildHTML']);
  gulp.watch(paths.allSrcCSS, ['buildCSS']);
  gulp.watch(paths.allSrcIMG, ['buildIMG', browserSync.reload]);
});
gulp.task('default', ['buildJS', 'buildCSS', 'buildIMG', 'buildHTML', 'watch', 'browser-sync']);
