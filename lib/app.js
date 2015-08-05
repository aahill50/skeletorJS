var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var root = __dirname + '/..';
var users = users || {};
var userID;
var username;
var validChars = '0123456789ABCDEF'.split('');

app.use(express.static(root + '/assets'));

app.get('/', function(req, res) {
    res.sendFile('assets/static_pages/index.html', { root: root });
});

io.on('connection', function (socket) {
    userID = socket.client.id;
    var username = getOrAssignUsername(userID);
    users[userID] = {};
    users[userID].username = username;

    console.log('%s connected!', username);
    socket.broadcast.emit('add user', username);
    socket.emit('get all users', users);

    socket.on('disconnect', function () {
        console.log('%s disconnected!', username);
        delete users[userID];
        io.emit('remove user', username);
    });

    socket.on('new message', function (msg) {
        io.emit('add message', getOrAssignUsername(userID), msg);
        console.log('%s says: %s', getOrAssignUsername(userID), msg)
    })
});

http.listen(3334, function () {
    console.log('listening on port: 3334');
});

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
