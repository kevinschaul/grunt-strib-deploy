/*
 * grunt-deploy
 * https://github.com/kevinschaul/strib-deploy
 *
 * Copyright (c) 2013 Kevin Schaul
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var exec = require('child_process').exec;

  grunt.registerTask('deploy', 'Deploy to apps.startribune.com', function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      appsSvnPath: '../apps',
      branch: 'master'
    });

    var branch = options.branch;
    var cwd = process.cwd();

    // Require `dateSlug` option
    if (!options.dateSlug) {
      grunt.log.error('dateSlug option is required.');
      return false;
    }

    // Ensure we are on correct git branch
    ensureCorrectGitBranch(cwd, options.branch, function(not_error) {
      done(not_error);
    });

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

  var ensureCorrectGitBranch = function(cwd, branch, callback) {
    var not_error = true;

    var child = exec('git branch', function(error, stdout, stderr) {
      if (error) {
        grunt.log.error(error);
        not_error = false;
      }

      if (stdout) {
        var this_branch = getCurrentBranch(stdout);
        grunt.verbose.write('Current branch is `' + this_branch + '`');

        if (this_branch !== branch) {
          grunt.log.error('Must deploy from `' + branch + '` branch.');
          grunt.log.error('(Current branch is `' + this_branch + '`)');
          not_error = false;
        }
      }

      if (callback) {
        callback(not_error);
      }
    });
  }

  var getCurrentBranch = function(stdout) {
    var re = /\* ([\S]+)/;
    var matches = re.exec(stdout);
    if (matches.length >= 2) {
      var this_branch = matches[1];
      return this_branch;
    }
  }

};

