/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
var Messages = {
    DEFAULT: 0,
    GRAY: 1,
    YELLOW: 2,
    RED: 3,
    BLUE: 4
};

Messages.log = function(message, type) {
    'use strict';

    // Remove the last message from the log
    if($('#log').children().length === 6) {
        $('#log').children().first().remove();
    }

    // Detemine the style of the message
    var style;
    switch(type) {
        case Messages.GRAY:
            style = 'color:gray;';
            break;
        case Messages.YELLOW:
            style = 'color:yellow;';
            break;
        case Messages.RED:
            style = 'color:red;';
            break;
        case Messages.BLUE:
            style = 'color:#00d3d3;';
            break;
        case undefined:
        case Messages.DEFAULT:
            style = 'color:white;';
            break;
    }

    // Add the new message to the log
    $('#log').append('<span style="' + style + '">' + message + '</span>');
};

Messages.clear = function() {
    'use strict';

    // Remove all messages from the log
    $('#log').children().remove();
};