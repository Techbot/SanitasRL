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
    
    $(document).on('keydown', function(e) {
        // If we're showing a screen, remove it if the user press enter
        if(game.state === 'welcome' && e.which === 13) {
            $('.window').fadeOut();
            game.state = 'running';
        } else if(game.state === 'death' && e.which === 13) {
            $('.window').fadeOut();
            game.initialize();
            game.state = 'running';
        } else if(game.state === 'score' && e.which === 13) {
            $('.window').fadeOut();
            game.initialize();
            game.state = 'running';
        } else {
            //game.keydown(e);
        }
    
    
        var key = e.which + (e.ctrlKey ? 400 : (e.altKey ? 600 : 0));
        if(Keys.hasOwnProperty(key)) {
            game.keydown(key, Keys[key]); // Should be input
            return false;
        }
    }).on('keypress', function(e) {
        if(Keys.hasOwnProperty(e.which + 200)) {
            game.keydown(e.which + 200, Keys[e.which + 200]); // Should be input
            return false;
        }
    }).bind(this);

    // Preload all images and initialize the game
    $.imgpreload(['images/items.png', 'images/tileset.png', 'images/monsters.png', 'images/player.png'], function() {
        game.initialize();
    });
});