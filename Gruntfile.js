/*
 * grunt-deploy
 * https://github.com/kevinschaul/strib-deploy
 *
 * Copyright (c) 2013 Kevin Schaul
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    deploy: {
      default_options: {
        options: {
        },
      },
      custom_options: {
        options: {
        },
      },
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);

};
