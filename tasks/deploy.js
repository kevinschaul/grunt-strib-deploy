/*
 * grunt-deploy
 * https://github.com/kevinschaul/strib-deploy
 *
 * Copyright (c) 2013 Kevin Schaul
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('deploy', 'Deploy to apps.startribune.com', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      appsSvnPath: '../apps',
      branch: 'master'
    });

    // Require `dateSlug` option
    if (!options.dateSlug) {
      grunt.log.error('dateSlug option is required.');
      return false;
    }

    // TODO
    // Ensure we are on correct git branch

    // TODO
    // Ensure all changes have been committed to git

    // TODO
    // Ensure appsSvnPath exists

    // TODO
    // Ensure local svn repository is up to date

    // TODO
    // Copy latest project files to local svn repository

    // TODO
    // Commit to svn repository using slug + most recent git message
  });

};

