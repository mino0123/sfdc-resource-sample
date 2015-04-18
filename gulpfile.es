let gulp = require('gulp');
let zip = require('gulp-zip');
let deploy = require('gulp-jsforce-deploy');
var compiler = require('gulp-closure-compiler');
let file = require('gulp-file');
let pkgxml = require('./tasks/lib/object2packagexml.es');

const SF_USERNAME = process.env.SF_USERNAME;
const SF_PASSWORD = process.env.SF_PASSWORD;

let metaxml =
`<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Private</cacheControl>
    <contentType>application/javascript</contentType>
</StaticResource>`;

gulp.task('default', () => {
  let version = '33.0';
  let types = [{ name: 'StaticResource', members: ['appjs'] }];
  let packagexml = pkgxml({ version, types });
  gulp.src('src/**', { base: './src' })
    .pipe(compiler({
      compilerPath: 'node_modules/closure-compiler/lib/vendor/compiler.jar',
      fileName: 'src/staticresources/appjs.resource'
    }))
    .pipe(file('src/package.xml', packagexml))
    .pipe(file('src/staticresources/appjs.resource-meta.xml', metaxml))
    .pipe(zip('pkg.zip'))
    .pipe(deploy({
      username: SF_USERNAME,
      password: SF_PASSWORD
    }))
});

gulp.task('watch', () => {
  gulp.watch('src/**', ['default']);
});
