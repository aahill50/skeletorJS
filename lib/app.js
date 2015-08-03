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
});

http.listen(3334, function () {
    console.log('listening on port: 3334');
});
