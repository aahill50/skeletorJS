var socket = io();

$(function () {
    $('.box').on('click', function (e) {
        var $things = $(e.currentTarget).find('.thing');
        var origClasses = [];

        e.preventDefault();

        $things.each(function (i, thing) {
            origClasses.push($(thing).attr('class'));
        });

        origClasses.shuffle();
        socket.emit('thingShuffle', origClasses);

        $things.each(function (i, thing) {
            $(thing).removeClass();
            $(thing).addClass(origClasses.shift())
        })
    })
});


Array.prototype.shuffle = function () {
    var counter = this.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = this[counter];
        this[counter] = this[index];
        this[index] = temp;
    }
};
