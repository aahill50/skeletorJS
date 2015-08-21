#! /usr/bin/env node
'use strict';

var fs = require('fs');
var Path = require('path');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var Q = require('q');
var colors = require('colors');
var filter = require('lodash.filter');
var reject = require('lodash.reject');
var args = process.argv.slice(2);
var installDir = args[0];
var directories = ['lib/templates', 'lib/routers', 'public/css', 'public/js', 'public/vendor'];
var mkDirErrs = {};
var __t = '   ';

var constructPath = function (base, ...dirs) {
    var deferred = Q.defer();
    var fullPath = Path.resolve([base].concat(dirs).join('/'));

    fs.realpath(fullPath, function (err, resolvedPath) {
        if (err) {
            //Directory doesn't exist, so create it
            mkdirp.sync(fullPath);
            deferred.resolve(fullPath);
        } else {
            //Directory already exists, just return it
            deferred.resolve(resolvedPath)
        }
    });

    return deferred.promise
};

var fullInstallPath = function (...dirs) {
    return constructPath(process.cwd(), installDir, ...dirs)
};

var relativePath = function (...dirs) {
    return constructPath(__dirname, ...dirs)
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
    var mkDirError;

    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        //The folder does not exist
    }

    // Only create a directory if it doesn't already exist with files
    if (files.length) {
        mkDirError = new Error(`Directory already exists and is not empty: ${dir}`);
        deferred.reject(mkDirError)
    } else {
        mkdirp(dir, function (err) {
            err ? deferred.reject(err) : deferred.resolve(dir);
        })
    }

    return deferred.promise
        .then(function (createdDir) {
            console.log(`Created directory: ${createdDir}`);
        }, function (err) {
            mkDirErrs[dir] = mkDirError;
            console.log(colors.red(err.toString()))
        });
};

var cpFile = function (sourcePath, destPath) {
    var file = sourcePath.split('/').pop();
    var copied = Q.defer();

    fs.writeFile(destPath, fs.readFileSync(sourcePath), function (err) {
        if (err) {
            console.log(colors.red(err.toString()));
            copied.reject(err);
        } else {
            console.log(`${__t}Copied ${file} --> ${destPath}`);
            copied.resolve(destPath);
        }
    });

    return copied.promise
};

var hasExtension = function (str) {
    return str.match(/^(\S+\.\S+)$/g)
};

var isExampleFile = function (str) {
    return str.match(/([\S]+_example\.[\S]+)/g)
};
var cpFiles = function (sourceDir, destDir) {
    sourceDir = Path.resolve(sourceDir);
    destDir = Path.resolve(destDir);
    var files = filter(fs.readdirSync(sourceDir), hasExtension);
    files = reject(files, isExampleFile);
    var cpFileFns = [];

    files.forEach(function (file) {
        cpFileFns.push(function () {
            return cpFile(sourceDir + '/' + file, destDir + '/' + file)
        })
    });

    return chain(cpFileFns)
};

if (installDir) {
    var mkDirFns = [];
    var fullPath;
    var relPath;

    directories.forEach(function (dir) {
        mkDirFns.push(function () {
            return fullInstallPath(dir)
                .then(function (path) {
                    fullPath = path;
                })
                .then(function () {
                    return relativePath('..', dir)
                })
                .then(function (path) {
                    relPath = path;
                }).then(function () {
                    return mkDir(fullPath)
                })
                .then(function () {
                    if (mkDirErrs[fullPath]) {
                        console.log(colors.red(`${__t}Files not copied to ${fullPath}`))
                    } else {
                        return cpFiles(relPath, fullPath)
                    }
                })
        });
    });

    chain(mkDirFns);

} else {
    throw new Error('No install directory given. An installation directory needs to be passed as the first argument.')
}
