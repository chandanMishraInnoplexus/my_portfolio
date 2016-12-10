var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    livereload = require("gulp-livereload"),
    concat = require("gulp-concat"),
    minifyCss = require("gulp-minify-css"),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    del = require('del'),
    inject = require('gulp-inject'),
    zip = require('gulp-zip'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    browserify    = require('browserify'),
    ngAnnotate    = require('browserify-ngannotate'),
    babelify      = require('babelify'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    source = require('vinyl-source-stream');


//var paths = require("./gulp-dep/inject.js");

//Watch path
var _PATH = {
    DEST: "public/dest",
    SCRIPT: "./public/scripts/**/*.js",
    SCSS_TARGET: "./public/assets/styles/main.scss",
    SCSS_STYLE: "./public/assets/styles/*.scss",
    HTML: "./public/**/*.html"
};

//SCSS
gulp.task('styles', function() {
    console.log("gulp task for scss");
    return gulp.src(_PATH.SCSS_TARGET)
        .pipe(plumber(function(err) {
            console.log("error occored in CSS");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: "compressed"
        }))
        //.pipe(concat('styles.css'))
        //.pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(_PATH.DEST))
        .pipe(livereload());
})

//Scripts
gulp.task('scripts', function() {
    console.info("gulp task scripts");
    return gulp.src(_PATH.SCRIPT)
        .pipe(plumber(function(err) {
            console.log("error occored in Js");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('allScripts.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(_PATH.DEST))
        .pipe(livereload());
});

gulp.task('browserify', function() {
  return browserify('./public/scripts/app.js')
      .transform(babelify, {presets: ["es2015"]})
      .transform(ngAnnotate)
      .bundle()
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('allScripts.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest(_PATH.DEST));
});


//zip
gulp.task("export", function() {
        return gulp.src("./public/**/*")
            .pipe(zip("website.zip"))
            .pipe(gulp.dest("./"));
    })
    //clean
gulp.task("clean", function() {
    console.info("gulp task clean");
    del.sync([
        'public/dest'
    ]);
})

gulp.task("index", function() {
    console.info("gulp task index");
    return gulp.src(_PATH.HTML)
        .pipe(livereload());

})

//Image
gulp.task("images", function() {
    return gulp.src("./public/images/**/*.{png,jpeg,jpg,svg,gif}")
        //.pipe(imagemin())   // lossless compression
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest("./public/dest" + "/images"));
});
//default
gulp.task("default", ['clean', 'browserify', 'styles', 'images', 'index'], function() {
    console.info("gulp task default");
});

//Watch
gulp.task("watch", ['default'], function() {
    require("./server.js");
    console.log("gulp is watching changes");
    livereload.listen();
    gulp.watch(_PATH.SCRIPT, ['browserify']);
    //gulp.watch(CSS_PATH, ['styles']);
    gulp.watch(_PATH.SCSS_STYLE, ['styles','index','browserify']);
    gulp.watch(_PATH.HTML, ['styles','browserify'] )
})