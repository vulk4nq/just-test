var webpack = require('webpack-stream')
var gulp = require('gulp'); 
gulp.task('default', function () {
  return gulp.src('src/bundle.js')
    .pipe(webpack({
      output: {
        filename: 'res.js'
      }
    }))
    .pipe(gulp.dest('dist'))
})