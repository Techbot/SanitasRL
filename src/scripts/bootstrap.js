/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
$(function() {
    'use strict';
    
    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    }());
    
    // Create the game instance
    var game = new Game();
    
    $('.window').hide();
    game.state = 'running';
    
    // Bind the resize and keydown methods to the game
    $(window).resize(function() {
        game.resize();
    }).resize();
    $(document).keydown(function(e) {
        // If we're showing a screen, remove it if the user press enter
        if(game.state === 'welcome' && e.which === Keys.VK_ENTER) {
            $('.window').fadeOut();
            game.state = 'running';
        } else if(game.state === 'death' && e.which === Keys.VK_ENTER) {
            $('.window').fadeOut();
            game.initialize();
            game.state = 'running';
        } else if(game.state === 'score' && e.which === Keys.VK_ENTER) {
            $('.window').fadeOut();
            game.initialize();
            game.state = 'running';
        } else {
            game.keydown(e);
        }
    });

    // Preload all images and initialize the game
    $.imgpreload(['images/items.png', 'images/tileset.png', 'images/monsters.png', 'images/player.png'], function() {
        game.initialize();
    });
});