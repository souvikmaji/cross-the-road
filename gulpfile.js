var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");

gulp.task("scripts", function() {
  gulp.
    src(["js/resources.js", "js/engine.js", "js/app.js"]).
    pipe(concat("main.js")).
    pipe(uglify()).
    pipe(gulp.dest("dist/js/"));
});

gulp.task("images", function() {
  return gulp.
    src("images/*").
    pipe(cache(imagemin({
          optimizationLevel: 5,
          progressive: true,
          interlaced: true
        }))).
    pipe(gulp.dest("dist/images/"));
});

gulp.task("copy", function() {
  gulp.src("index.html").pipe(gulp.dest("dist/"));
  gulp.src("css/*").pipe(gulp.dest("dist/css/"));
});

gulp.task("watch", function() {
  gulp.watch("js/**.js", ["scripts"]);
  gulp.watch(["css/**.css", "index.html"], ["copy"]);
  gulp.watch("images/**", ["images"]);
});

gulp.task("default", ["scripts", "images", "copy", "watch"]);
