/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
var Player = function(x, y) {
    'use strict';

    this.x = x;
    this.y = y;

    this.health = 40;

    this.updateInterface();
};

Player.prototype.updateInterface = function() {
    'use strict';

    $('.character-health').text(this.health);
    $('.character-damage').text('0');
    $('.character-defence').text('0');

    $('.character-weapon').text('none');
};