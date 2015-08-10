#! /usr/bin/env node
'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var Q = require('q');
var colors = require('colors');
var args = process.argv.slice(2);
var installDir = process.cwd() + '/' + args[0];

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
        deferred.reject(new Error('Directory already exists: ' + dir))
    } else {
        mkdirp(dir, function (err) {
            err ? deferred.reject(err) : deferred.resolve();
        })
    }

    return deferred.promise;
};

mkDir(installDir)
    .then(function () {
        console.log('Created directory:', installDir);
    }, function (err) {
        console.log(colors.red(err.toString()))
    });
