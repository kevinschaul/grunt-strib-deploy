/*
 * grunt-deploy
 * https://github.com/kevinschaul/strib-deploy
 *
 * Copyright (c) 2013 Kevin Schaul
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var async = require('async');
  var exec = require('child_process').exec;
  var fs = require('fs');
  var ncp = require('ncp').ncp;
  var path = require('path');

  grunt.registerTask('deploy', 'Deploy to apps.startribune.com', function() {
    var done = this.async();

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

    var branch = options.branch;
    var cwd = process.cwd();

    async.series([
        function(cb) {
          ensureCorrectGitBranch(cb, branch);
        },
        function(cb) {
          ensureNoPendingChanges(cb);
        },
        function(cb) {
          ensureAppsSvnPathExists(cb, options.appsSvnPath);
        },
        function(cb) {
          copyLocalToSvn(cb, options.appsSvnPath, options.dateSlug);
        }
      ], function(err, results) {

    });

    /*
    // Ensure we are on correct git branch
    ensureCorrectGitBranch(cwd, options.branch, function(not_error) {
      not_error = true;
      if (!not_error) done(not_error);

      // Ensure all changes have been committed to git
      ensureNoPendingChanges(cwd, function(not_error) {
        if (!not_error) done(not_error);

        // Ensure appsSvnPath exists
        ensureAppsSvnPathExists(cwd, options.appsSvnPath, function(not_error) {
          if (!not_error) done(not_error);

          // TODO
          // Ensure local svn repository is up to date

          // Copy latest project files to local svn repository
          copyLocalToSvn(cwd, options.appsSvnPath, options.dateSlug,
              function(not_error) {
            if (!not_error) done(not_error);

            // TODO
            // Commit to svn repository using slug + most recent git message
            // To get most recent git message: ` git log -n 1 --pretty=format:%s`
            commitSvn(cwd, options.appsSvnPath, options.dateSlug, function(not_error) {
              if (!not_error) done(not_error);

              done(not_error);
            });
          });
        });
      });
    });
    */
  });

  var ensureCorrectGitBranch = function(cb, branch) {
    var child = exec('git branch', function(error, stdout, stderr) {
      if (error) {
        grunt.log.error(error);
        cb(1);
      }

      if (stdout) {
        var this_branch = getCurrentBranch(stdout);
        grunt.verbose.write('Current branch is `' + this_branch + '`\n');

        if (this_branch !== branch) {
          grunt.log.error('Must deploy from `' + branch + '` branch.\n');
          grunt.log.error('(Current branch is `' + this_branch + '`)\n');
          cb(1);
        }

        cb();
      }
    });
  }

  var ensureNoPendingChanges = function(cb, callback) {
    var child = exec('git status -s', function(error, stdout, stderr) {
      if (error) {
        grunt.log.error(error);
        cb(1);
      }

      if (stdout) {
        grunt.log.error('Please commit your pending changes.\n');
        cb(1);
      }

      cb();
    });
  }

  var ensureAppsSvnPathExists = function(cb, appsSvnPath) {
    fs.exists(appsSvnPath, function(exists) {
      if (!exists) {
        grunt.log.error('Please correct your `appsSvnPath`.\n');
        cb(1);
      }

      cb();
    });
  }

  var copyLocalToSvn = function(cb, appsSvnPath, dateSlug) {
    var source = 'public';
    var dest = path.join(appsSvnPath, 'htdocs', 'news', dateSlug);

    ncp(source, dest, function(error) {
      if (error) {
        grunt.log.error('Error copying project to svn:\n');
        grunt.log.error(error);
        cb(1);
      }

      cb();
    });
  }

  // To get most recent git message: ` git log -n 1 --pretty=format:%s`
  var commitSvn = function(cwd, appsSvnPath, dateSlug,
      callback) {
    var not_error = true;

    var child = exec('git log -n 1 --pretty=format:%s',
          function(error, stdout, stderr) {
      if (error) {
        grunt.log.error(error);
        not_error = false;
      }

      var message = stdout;
      if (message) {
        // TODO Commit
      } else {
        grunt.log.error('Could not find the latest commit message');
        not_error = false;
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

