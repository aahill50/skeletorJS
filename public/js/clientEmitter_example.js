var socket = io();

$(function () {
    $('#messageInput').on('submit', function (e) {
        var $input = $(this).find('input');
        var msg = $input.val();
        e.preventDefault();

        if (msg) {
            socket.emit('new message', msg);
            $input.val('');
        }
    });

    socket.on('get all users', function (userlist) {
        var users = Object.keys(userlist);

        users.forEach(function (user) {
            addUserToList(userlist[user].username);
        })
    });

    socket.on('add user', function (user) {
        addUserToList(user);
    });

    socket.on('remove user', function (user) {
        console.log('removing %s', user);
        removeUserFromList(user);
    });

    socket.on('add message', function (username, message) {
        var $messageList = $('#messageList');
        var $message = $('<span>');
        $message.addClass('message');
        $message.text(username + ': ' + message);
        $messageList.append($message);

        $messageList.scrollTop($messageList[0].scrollHeight);

    });

    function addUserToList(username) {
        var $userlist = $('.userlist');
        var $li = $('<li>');
        $li.addClass('username');
        $li.text(username);
        $userlist.append($li)
    }

    function removeUserFromList(username) {
        var $li = $('li.username:contains("' + username + '")');
        $li.remove();
    }
});
