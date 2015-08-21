'use strict';

//Enables es6 syntax in all '.es.js' files
require('babel/register')({ only: ['.es.js'] });

var express = require('express');
var fs = require('fs');
var app = root.app = express();
var rootDir = root.rootDir = fs.realpathSync(__dirname + '/..');
var server = root.server = require('http').Server(app);
var appRouter = require('./routers/appRouter_example');
var socketHandler = require('./handlers/socketHandler_example');

//Initialize router and socket handler
appRouter();
socketHandler();

app.use('/public', express.static(rootDir + '/public'));

server.listen(3334, function () {
    console.log('listening on port: 3334');
});
