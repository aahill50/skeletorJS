var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var root = __dirname + '/..';

app.use(express.static(root + '/assets'));

app.get('/', function(req, res){
    res.sendFile('assets/static_pages/index.html', { root: root });
});

io.on('connection', function (socket) {
    console.log('a user connected:', socket.client.id);

    socket.on('thingShuffle', function (newOrder) {
        console.log('Shuffled things...', newOrder.map(function (classes) {
            var color = classes.split(' ')[1];
            return color.split('')[0].toUpperCase() + (color.split('').slice(1)).join('')
        }))
    })
});

http.listen(3334, function () {
    console.log('listening on port: 3334');
});
