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
                x: 1,
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
                x: 0,
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
                x: 3,
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
                x: 4,
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
                x: 6,
                y: 0
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
                x: 1,
                y: 0
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
                x: 1,
                y: 0
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
                y: 0
            };
        },
        colour: '#666'
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
                y: 0
            };
        },
        colour: '#a2a2a2'
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
                x: 0,
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
                x: 4,
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
                x: 6,
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
                y: 0
            };
        },
        colour: '#ff7300'
    }
};