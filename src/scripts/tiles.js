/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */

// solid: Whether an entity can move through this tile
// transparent: Whether the FOV can move through this tile
// look: The message displayed when this tile is looked at
// image: The image displayed when this tile is drawn
var Tile = {
    EMPTY: {
        id: -1,
        color: undefined,
        solid: undefined,
        transparent: undefined,
        look: function() {
            'use strict';
            return undefined;
        },
        image: undefined,
        colour: undefined
    },
    FLOOR: {
        id: 0,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return undefined;
        },
        image: function() {
            'use strict';
            return {
                x: 0,
                y: 0
            };
        },
        colour: '#444'
    },
    WALL: {
        id: 1,
        solid: true,
        transparent: false,
        color: function() {
            'use strict';
            return '#666';
        },
        look: function() {
            'use strict';
            return 'A wall';
        },
        image: function() {
            'use strict';
            return {
                x: 3,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    WATER: {
        id: 2,
        solid: true,
        transparent: true,
        color: function() {
            'use strict';
            return '#1180e6';
        },
        look: function() {
            'use strict';
            return 'Some water';
        },
        image: function() {
            'use strict';
            return {
                x: 1,
                y: 0
            };
        },
        colour: '#175ba9'
    },
    STAIRS: {
        id: 3,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#f7911e';
        },
        look: function() {
            'use strict';
            return 'A staircase leading down';
        },
        image: function() {
            'use strict';
            return {
                x: 4,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    DOOR: {
        id: 4,
        solid: false,
        transparent: false,
        color: function() {
            'use strict';
            return '#888';
        },
        look: function() {
            'use strict';
            return 'A closed door';
        },
        image: function(tileBelow) {
            'use strict';
            return {
                x: 5,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    DOOR_OPEN: {
        id: 5,
        solid: false,
        transparent: false,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return 'An open door';
        },
        image: function() {
            'use strict';
            return {
                x: 7,
                y: 0
            };
        },
        colour: '#444'
    },
    TRAP: {
        id: 6,
        solid: false,
        transparent: false,
        color: function(player) {
            'use strict';
            if(player.armour.id === 'rogues_hide') { // Should check for the effect player.effects.indexOf(Effects.spotTraps)?
                return '#fff569';
            }

            return '#888';
        },
        look: function(player) {
            'use strict';
            if(player.armour.id === 'rogues_hide') { // Should check for the effect player.effects.indexOf(Effects.spotTraps)?
                return 'A trapped door';
            }

            return 'A closed door';
        },
        image: function(tileBelow, player) {
            'use strict';
            return {
                x: player.armour.id === 'rogues_hide' ? 6 : 5, // Should check for the effect player.effects.indexOf(Effects.spotTraps)?
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    TRAP_SPRUNG: {
        id: 7,
        solid: false,
        transparent: false,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return 'A sprung trap';
        },
        image: function() {
            'use strict';
            return {
                x: 7,
                y: 1
            };
        },
        colour: '#444'
    },
    SHRINE: {
        id: 8,
        solid: true,
        transparent: true,
        color: function() {
            'use strict';
            return '#8c56be';
        },
        look: function() {
            'use strict';
            return 'A water-filled well';
        },
        image: function() {
            'use strict';
            return {
                x: 3,
                y: 1
            };
        },
        colour: '#8a1e51'
    },
    SHRINE_USED: {
        id: 9,
        solid: true,
        transparent: true,
        color: function() {
            'use strict';
            return '#9883ab';
        },
        look: function() {
            'use strict';
            return 'An empty well';
        },
        image: function() {
            'use strict';
            return {
                x: 4,
                y: 1
            };
        },
        colour: '#682444'
    },
    PILLAR: {
        id: 10,
        solid: true,
        transparent: true,
        color: function() {
            'use strict';
            return '#888';
        },
        look: function() {
            'use strict';
            return 'A pillar reaching the ceiling';
        },
        image: function() {
            'use strict';
            return {
                x: 1,
                y: 1
            };
        },
        colour: '#a2a2a2'
    },
    BARS: {
        id: 11,
        solid: true,
        transparent: true,
        color: function() {
            'use strict';
            return '#888';
        },
        look: function() {
            'use strict';
            return 'Iron bars';
        },
        image: function() {
            'use strict';
            return {
                x: 2,
                y: 1
            };
        },
        colour: '#a2a2a2'
    },
    BARS_TRAP: {
        id: 12,
        solid: false,
        transparent: true,
        color: function(player) {
            'use strict';
            if(player.armour.id === 'rogues_hide') { // Should check for the effect player.effects.indexOf(Effects.spotTraps)?
                return '#fff569';
            }

            return '#888';
        },
        look: function(player) {
            'use strict';
            if(player.armour.id === 'rogues_hide') { // Should check for the effect player.effects.indexOf(Effects.spotTraps)?
                return 'A trapped iron bars door';
            }

            return 'A closed iron bars door';
        },
        image: function(tileBelow, player) {
            'use strict';
            return {
                x: player.armour.id === 'rogues_hide' ? 6 : 5, // Should check for the effect player.effects.indexOf(Effects.spotTraps)?
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    BARS_TRAP_SPRUNG: {
        id: 13,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return 'A sprung trap';
        },
        image: function() {
            'use strict';
            return {
                x: 7,
                y: 0
            };
        },
        colour: '#444'
    },
    BLOOD_STAINED_FLOOR: {
        id: 14,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return 'A corpse';
        },
        image: function() {
            'use strict';
            return {
                x: 2,
                y: 0
            };
        },
        colour: '#c00'
    },
    BARS_DOOR: {
        id: 15,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#888';
        },
        look: function() {
            'use strict';
            return 'A closed iron bars door';
        },
        image: function(tileBelow) {
            'use strict';
            return {
                x: 5,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    BARS_DOOR_OPEN: {
        id: 23,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return 'An open iron bars door';
        },
        image: function() {
            'use strict';
            return {
                x: 7,
                y: 0
            };
        },
        colour: '#444'
    },
    MONSTER_SPAWNER: { // MAYBE OTHER TYPE?
        id: 16,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return 'A strange looking floor';
        },
        image: function() {
            'use strict';
            return {
                x: 0,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    BOSS_WALL: {
        id: 17,
        solid: true,
        transparent: true,
        color: function() {
            'use strict';
            return '#666';
        },
        look: function() {
            'use strict';
            return 'A wall';
        },
        image: function() {
            'use strict';
            return {
                x: 3,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    BOSS_FOV_FIX: {
        id: 19,
        solid: true,
        transparent: false,
        color: function() {
            'use strict';
            return '#000';
        },
        look: function() {
            'use strict';
            return 'You can\'t see that far.';
        },
        image: '#444'
    },
    BOSS_FLOOR: {
        id: 18,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return 'BOSS FLOOR';
        },
        image: function() {
            'use strict';
            return {
                x: 0,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    BOSS_DOOR: {
        id: 20,
        solid: false,
        transparent: false,
        color: function() {
            'use strict';
            return '#dabf2c';
        },
        look: function() {
            'use strict';
            return 'A closed door';
        },
        image: function(tileBelow) {
            'use strict';
            return {
                x: 5,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    BOSS_SECOND_DOOR: {
        id: 21,
        solid: false,
        transparent: false,
        color: function() {
            'use strict';
            return '#dabf2c';
        },
        look: function() {
            'use strict';
            return 'A closed door';
        },
        image: function(tileBelow) {
            'use strict';
            return {
                x: 5,
                y: 0
            };
        },
        colour: '#a2a2a2'
    },
    BOSS_HALLWAY: {
        id: 22,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return undefined;
        },
        image: function() {
            'use strict';
            return {
                x: 0,
                y: 0
            };
        },
        colour: '#444'
    },
    FIREBALL: {
        id: 30,
        solid: false,
        transparent: true,
        color: function() {
            'use strict';
            return '#ff7200';
        },
        look: function() {
            'use strict';
            return 'A fire';
        },
        image: function() {
            'use strict';
            return {
                x: 0,
                y: 1
            };
        },
        colour: '#ff7300'
    },

    FOV_FIX: {
        id: 9999,
        solid: false,
        transparent: false,
        color: function() {
            'use strict';
            return '#333';
        },
        look: function() {
            'use strict';
            return undefined;
        },
        image: function() {
            'use strict';
            return {
                x: 0,
                y: 0
            };
        },
        colour: '#444'
    },
    HIGHLIGHT: {
        id: 10000,
        solid: false,
        transparent: false,
        color: function() {
            'use strict';
            return '#0f0';
        },
        look: function() {
            'use strict';
            return undefined;
        },
        image: function() {
            'use strict';
            return {
                x: 0,
                y: 0
            };
        },
        colour: undefined
    }
};