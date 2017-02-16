'use strict';

var basename = require('path').basename;

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      files: ['dist']
    },

    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'lib',
          src: ['**/videojs-hlsjs-es6.js'],
          dest: 'dist/',
          rename: function(dest, src) {
            return dest + src.replace('-es6', '');
          },
          ext:'.js'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default',
    ['clean',
      'babel'
    ]);
};
