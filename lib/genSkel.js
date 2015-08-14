#! /usr/bin/env node
'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var Q = require('q');
var colors = require('colors');
var args = process.argv.slice(2);
var installDir = args[0];
var directories = ['lib/templates', 'lib/routers', 'public/css', 'public/js', 'public/vendor'];

var fullInstallPath = function (dir) {
    if (dir) {
        return process.cwd() + '/' + installDir + '/' + dir;
    }
    return process.cwd() + '/' + installDir;
};

var chain = function (arrayOfFunctions) {
    var lastPromise = Q();

    arrayOfFunctions.forEach(function (fn) {
        lastPromise = lastPromise
            .then(function () {
                return fn.call()
            });
    });

    return lastPromise
};


var mkDir = function (dir) {
    var deferred = Q.defer();
    var files = [];

    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        //The folder does not exist
    }

    // Only create a directory if it doesn't already exist with files
    if (files.length) {
        deferred.reject(new Error('Directory already exists and is not empty: ' + dir))
    } else {
        mkdirp(dir, function (err) {
            err ? deferred.reject(err) : deferred.resolve(dir);
        })
    }

    return deferred.promise
        .then(function (createdDir) {
            console.log('Created directory:', createdDir);
        }, function (err) {
            console.log(colors.red(err.toString()))
        });
};

if (installDir) {
    var mkDirFns = [];

    directories.forEach(function (dir) {
        mkDirFns.push(function () {
            return mkDir(fullInstallPath(dir))
        })
    });

    chain(mkDirFns);

} else {
    throw new Error('No install directory given. An installation directory needs to be passed as the first argument.')
}
