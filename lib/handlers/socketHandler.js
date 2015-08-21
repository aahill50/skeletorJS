/**
 * Created by aaron.hill on 8/12/15.
 */
'use strict';

/**
 * Server side socket handling
 *
 * Set up server side socket handling logic by using 'socket.on' within the 'io.on' callback
 */

var userID;

var io = require('socket.io')(root.server);

function disconnect() {
    console.log('%s disconnected', username);
    delete users[userID];
    io.emit('remove user', username);
}

var socketHandler = module.exports = function(_server) {
    io.on('connection', function (socket) {
        userID = socket.client.id;

        socket.on('disconnect', disconnect);
    });
};
