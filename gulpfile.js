/**
 * Created by hp on 2017-03-24.
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var uglify = require('uglify-js');

var download = require('gulp-download');
var sequence = require('run-sequence');

var rename = require('gulp-rename');

var autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

var config = {
    dist: 'dist/',
    src: 'src/',
    cssin: 'src/css/**/*.css',
    jsin: 'web/js/lib/*.js',
    imgin: 'web/images/**/*.{jpg,jpeg,png,gif}',
    htmlin: 'src/*.html',
    scssin: 'src/scss/**/*.scss',
    cssout: 'dist/css/',
    jsout: 'dist/js/',
    imgout: 'web/images',
    htmlout: 'dist/',
    scssout: 'src/css/',
    cssoutname: 'style.css',
    jsoutname: 'script.js',
    cssreplaceout: 'css/style.css',
    jsreplaceout: 'js/script.js',
    externaljs: [
        'https://code.jquery.com/jquery-3.6.3.js',
        'https://cdn.jsdelivr.net/npm/bootstrap/dist/js/bootstrap.bundle.min.js',
        'http://afarkas.github.io/lazysizes/lazysizes.min.js',
        'https://code.jquery.com/jquery-1.12.4.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/blueimp-gallery/2.32.0/js/jquery.blueimp-gallery.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/blueimp-gallery/2.32.0/js/blueimp-gallery-fullscreen.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/blueimp-gallery/2.32.0/js/blueimp-gallery-indicator.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/blueimp-gallery/2.32.0/js/blueimp-helper.min.js',
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/+esm',
        'https://cdnjs.cloudflare.com/ajax/libs/jarallax/1.10.1/jarallax.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jarallax/1.10.1/jarallax-video.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery.sticky/1.0.4/jquery.sticky.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery-one-page-nav/3.0.0/jquery.nav.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/superslides/0.6.2/jquery.superslides.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.2/moment.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.2/moment-with-locales.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.2/jquery.matchHeight-min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/unveil/1.3.0/jquery.unveil.min.js',
        'https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js',
        'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js',
        'https://unpkg.com/iframe-lightbox@0.2.9/js/iframe-lightbox.js',
        'https://cdnjs.cloudflare.com/ajax/libs/bPopup/0.11.0/jquery.bpopup.min.js',
        'https://raw.githubusercontent.com/kombai/freewall/master/freewall.js',
        'https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery-countto/1.2.0/jquery.countTo.js'
    ],
    requirejs: [
        'web/js/lib/jquery-3.6.3.js',
        'web/js/lib/modernizr.min.js',
        'web/js/lib/jquery.blueimp-gallery.min.js',
        'web/js/lib/blueimp-gallery-fullscreen.min.js',
        'web/js/lib/blueimp-gallery-indicator.min.js',
        'web/js/lib/blueimp-helper.min.js',
        'web/js/lib/bootstrap.bundle.min.js',
        //'web/js/lib/popper.min.js',
        'web/js/lib/lazysizes.min.js',
        'web/js/lib/jarallax.min.js',
        'web/js/lib/jarallax-video.min.js',
        'web/js/lib/jquery.sticky.min.js',
        'web/js/lib/jquery.easing.min.js',
        'web/js/lib/wow.min.js',
        //'web/js/lib/jquery.superslides.min.js',
        'web/js/lib/owl.carousel.min.js',
        'web/js/lib/jquery.nav.js',
        'web/js/lib/moment.min.js',
        'web/js/lib/moment-with-locales.min.js',
        'web/js/lib/bootstrap-datetimepicker.min.js',
        'web/js/lib/jquery.unveil.min.js',
        //'web/js/lib/jquery.matchHeight-min.js',
        //'web/js/lib/imagesloaded.pkgd.js',
        'web/js/lib/isotope.pkgd.min.js',
        'web/js/lib/jquery.daterangepicker.min.js',
        'web/js/lib/iframe-lightbox.js',
        'web/js/lib/freewall.js',
        'web/js/lib/jquery.waypoints.js',
        'web/js/lib/jquery.countTo.js'



    ],
    jslib: 'web/js/lib',
    externalcss: [
        'https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/blueimp-gallery/2.32.0/css/blueimp-gallery.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/blueimp-gallery/2.32.0/css/blueimp-gallery-indicator.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/css/bootstrap-datetimepicker.min.css',
        'https://unpkg.com/iframe-lightbox@0.2.9/css/iframe-lightbox.css'
    ],
    requirecss: [
        'web/css/vendor/bootstrap.min.css',
        //'web/css/vendor/font-awesome.min.css',
        'web/css/vendor/owl.carousel.min.css',
        'web/css/vendor/animate.min.css',
        'web/css/vendor/blueimp-gallery.min.css',
        'web/css/vendor/blueimp-gallery-indicator.min.css',
        'web/css/vendor/bootstrap-datetimepicker.min.css',
        'web/css/vendor/iframe-lightbox.css'

    ],
    csslib: 'web/css/vendor'


};


gulp.task('js', async  function () {
    config.requirejs.push('web/js/scripts.js');
    gulp.src(config.requirejs)
        .pipe(concat('app.js'))
        .pipe(minify())
        .pipe(gulp.dest('web/js'));
});



gulp.task('js_dev', async  function () {

    gulp.src(config.requirejs)
        .pipe(concat('lib.js'))

        .pipe(gulp.dest('web/js'));


});

gulp.task('css', async  function () {

    gulp.src(['web/css/lib.css','web/css/style.css'])

        .pipe(concat('app.min.css'))
        .pipe(autoprefixer())
        .pipe(rename({extname: '.css'}))

        .pipe(cleanCSS('app.min.css'))
        .pipe(gulp.dest('web/css'));


});



gulp.task('download', async function () {
    download(config.externaljs)
        .pipe(gulp.dest(config.jslib));
    download(config.externalcss)
        .pipe(gulp.dest(config.csslib));
});



gulp.task('default', async function () {
    sequence('download', ['js', 'css']);
});
