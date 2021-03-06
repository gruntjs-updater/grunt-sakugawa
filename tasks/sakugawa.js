/**
 * grunt-sakugawa
 * https://github.com/paazmaya/grunt-sakugawa
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (http://paazmaya.fi)
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');

const sakugawa = require('sakugawa');

module.exports = function gruntSakugawa(grunt) {

  grunt.registerMultiTask('sakugawa', 'CSS splitter, filter and organiser', function register() {

    var options = this.options({
      maxSelectors: 4090,
      mediaQueries: 'normal',
      minSheets: 1,
      suffix: '_'
    });

    this.files.forEach(function eachFiles(file) {
      var src = file.src.filter(function filterSrc(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        else {
          return true;
        }
      });

      var contents,
        pages,
        dest = file.dest;

      src.forEach(function eachSrc(srcPath) {
        contents = grunt.file.read(srcPath);
        pages = sakugawa(contents, options);

        if (!dest) {
          dest = srcPath;
        }

        if (dest.substr(-1, 1) === '/') {
          dest += path.basename(srcPath);
        }

        pages.forEach(function eachPages(css, index) {
          var target = dest.replace(/\.css/, options.suffix + (index + 1) + '.css');
          grunt.file.write(target, css);
        });
      });

    });
  });

};
