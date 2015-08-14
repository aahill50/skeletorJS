/**
 * Created by aaron.hill on 8/12/15.
 */
'use strict';

var io = require('socket.io')(root.server);
var users = users || {};
var userID;
var username;
var validChars = '0123456789ABCDEF'.split('');

function getOrAssignUsername(userID) {
    var newName;

    if (users[userID]) {
        return users[userID].username
    } else {
        newName = 'Anon_' + genRandomStr(6);
        users[userID] = users[userID] || {};
        users[userID].username = newName;
    }

    return newName
}

function genRandomStr(length) {
    var str = '';

    for (var i = 0; i < length; i++) {
        str += genRandomChar();
    }

    return str
}

function genRandomChar () {
    return validChars[rand(0, validChars.length - 1)];
}

function rand(min, max) {
    var range = max - min;
    return Math.floor(Math.random() * range) + min;
}

function disconnect() {
    console.log('%s disconnected!', username);
    delete users[userID];
    io.emit('remove user', username);
}

function newMessage(msg) {
    io.emit('add message', getOrAssignUsername(userID), msg);
    console.log('%s says: %s', getOrAssignUsername(userID), msg)
}

var socketHandler = module.exports = function(_server) {
    io.on('connection', function (socket) {
        userID = socket.client.id;
        var username = getOrAssignUsername(userID);
        users[userID] = {};
        users[userID].username = username;

        console.log('%s connected!', username);
        socket.broadcast.emit('add user', username);
        socket.emit('get all users', users);

        socket.on('disconnect', disconnect);

        socket.on('new message', newMessage);
    });
};
