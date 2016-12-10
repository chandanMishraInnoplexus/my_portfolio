var gulp          = require('gulp');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var babelify      = require('babelify');
var ngAnnotate    = require('browserify-ngannotate');
var browserSync   = require('browser-sync').create();
var rename        = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify        = require('gulp-uglify');
var merge         = require('merge-stream');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var livereload = require("gulp-livereload");
var del = require('del');


// Where our files are located
var jsFiles   = "public/scripts/**/*.js";
var viewFiles = "public/scripts/**/*.html";
var SCSS_TARGET = "./public/assets/styles/main.scss";


var _PATH = {
    DEST: "./public/build/",
    HOSTING_PATH: "./public",
    SCRIPT: "./public/scripts/**/*.js",
    SCSS_TARGET: "./public/assets/styles/main.scss",
    SCSS_STYLE: "./public/assets/styles/*.scss",
    HTML: "./public/**/*.html"
};


gulp.task('browserify', ['views'], function() {
    console.info("Script Task in process");
  return browserify('./public/scripts/app.js',{debug: true})
      .transform(babelify, {presets: ["es2015"]})
      .transform(ngAnnotate)
      .bundle()
      //.on('error', interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('main.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest(_PATH.DEST))
      .pipe(livereload());
});

gulp.task('html', function() {
  return gulp.src("public/index.html")
      .pipe(gulp.dest(_PATH.DEST));
});

gulp.task('views', function() {
  return gulp.src(viewFiles)
      .pipe(templateCache({
        standalone: true
      }))
      //.on('error', interceptErrors)
      .pipe(rename("app.templates.js"))
      .pipe(gulp.dest('./public/scripts/config/'));
});

gulp.task("clean", function() {
    console.info("gulp task clean");
    del.sync([
        _PATH.DEST
    ]);
})

gulp.task("index", function() {
    console.info("gulp task index");
    return gulp.src(_PATH.HTML)
        .pipe(livereload());

})

gulp.task('css', function(){
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

gulp.task('SCSS',['css'], function(){
  console.log("TASK RUN SCSS");
  return gulp.src(_PATH.SCSS_STYLE)
         .pipe(livereload());
})

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', ['clean','html', 'browserify'], function() {
  var html = gulp.src("public/build/index.html")
                 .pipe(gulp.dest('./dist/'));

  var js = gulp.src("public/build/main.js")
               .pipe(uglify())
               .pipe(gulp.dest('./dist/'));

  return merge(html,js);
});

gulp.task('default', ['clean', 'browserify', 'SCSS','html'], function() {

  browserSync.init(['./public/build/**/**.**'], {
    server: _PATH.HOSTING_PATH,
    port: 3000,
    notify: false,
    ui: {
      port: 4001
    }
  });
  livereload.listen();
  gulp.watch("public/index.html", ['html']);
  gulp.watch(viewFiles, ['views']);
  gulp.watch(jsFiles, ['browserify']);
  gulp.watch(_PATH.SCSS_STYLE, ['SCSS']);
});
