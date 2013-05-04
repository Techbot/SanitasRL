/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
Math.adjustedRandom = function(min, max) {
    'use strict';

    return Math.floor(Math.random() * ((max - min) + 1)) + min;
};