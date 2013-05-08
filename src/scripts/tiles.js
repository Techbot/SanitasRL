// solid: Whether an entity can move through this tile
// transparent: Whether the FOV can move through this tile
// look: The message displayed when this tile is looked at
// image: The image displayed when this tile is drawn
var Tile = {
    FLOOR: {
        id: 0,
        solid: false,
        transparent: true,
        look: function() {
            'use strict';
            return undefined;
        },
        image: { x: 0, y: 0 },
        color: '#444'
    },
    WALL: {
        id: 1,
        solid: true,
        transparent: false,
        look: function() {
            'use strict';
            return 'A wall';
        },
        image: { x: 1, y: 0 },
        color: '#a2a2a2'
    },
    WATER: {
        id: 2,
        solid: true,
        transparent: true,
        look: function() {
            'use strict';
            return 'Some water';
        },
        image: { x: 0, y: 0 },
        color: '#175ba9'
    },
    STAIRS: {
        id: 3,
        solid: false,
        transparent: true,
        look: function() {
            'use strict';
            return 'A staircase leading down';
        },
        image: { x: 3, y: 0 },
        color: '#a2a2a2'
    },
    DOOR: {
        id: 4,
        solid: false,
        transparent: false,
        look: function() {
            'use strict';
            return 'A closed door';
        },
        image: { x: 4, y: 0 },
        color: '#a2a2a2'
    },
    DOOR_OPEN: {
        id: 5,
        solid: false,
        transparent: false,
        look: function() {
            'use strict';
            return 'An open door';
        },
        image: { x: 6, y: 0 },
        color: '#444'
    },
    SHRINE: {
        id: 8,
        solid: true,
        transparent: true,
        look: function() {
            'use strict';
            return 'A water-filled well';
        },
        image: { x: 1, y: 0 },
        color: '#8a1e51'
    },
    SHRINE_USED: {
        id: 9,
        solid: true,
        transparent: true,
        look: function() {
            'use strict';
            return 'An empty well';
        },
        image: { x: 1, y: 0 },
        color: '#682444'
    },
    PILLAR: {
        id: 10,
        solid: true,
        transparent: true,
        look: function() {
            'use strict';
            return 'A pillar reaching the ceiling';
        },
        image: { x: 1, y: 0 },
        color: '#666'
    },
    BARS: {
        id: 11,
        solid: true,
        transparent: true,
        look: function() {
            'use strict';
            return 'Iron bars';
        },
        image: { x: 2, y: 0 },
        color: '#a2a2a2'
    },
    BLOOD_STAINED_FLOOR: {
        id: 14,
        solid: false,
        transparent: true,
        look: function() {
            'use strict';
            return 'A corpse';
        },
        image: { x: 0, y: 0 },
        color: '#c00'
    },
    BARS_DOOR: {
        id: 15,
        solid: false,
        transparent: true,
        look: function() {
            'use strict';
            return 'A closed iron bars door';
        },
        image: { x: 4, y: 0 },
        color: '#a2a2a2'
    },
    BARS_DOOR_OPEN: {
        id: 23,
        solid: false,
        transparent: true,
        look: function() {
            'use strict';
            return 'An open iron bars door';
        },
        image: { x: 6, y: 0 },
        color: '#444'
    },
    MONSTER_SPAWNER: { // MAYBE OTHER TYPE?
        id: 16,
        solid: false,
        transparent: true,
        look: function() {
            'use strict';
            return 'A strange looking floor';
        },
        image: { x: 0, y: 0 },
        color: '#a2a2a2'
    },
    FIREBALL: {
        id: 30,
        solid: false,
        transparent: true,
        look: function() {
            'use strict';
            return 'A fire';
        },
        image: { x: 0, y: 0 },
        color: '#ff7300'
    }
};