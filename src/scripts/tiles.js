var Tile = {
    EMPTY: {
        id: -1,
        entityPasses: false,
        lightPasses: false,
        reflects: false,
        look: undefined,
        image: undefined,
        light: undefined,
        color: undefined,
        interact: undefined
    },
    FLOOR: {
        id: 0,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'The dungeon floor',
        image: { x: 0, y: 0 },
        light: undefined,
        color: 'rgb(68, 68, 68)',
        interact: undefined
    },
    GRASS: {
        id: 1,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'Some grass',
        image: { x: 0, y: 0 },
        light: undefined,
        color: 'rgb(34, 122, 48)',
        interact: undefined
    },
    FOILAGE: {
        id: 2,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'Some foilage',
        image: { x: 1, y: 0 },
        light: undefined,
        color: 'rgb(34, 122, 48)',
        interact: undefined
    },
    WATER: {
        id: 3,
        entityPasses: false,
        lightPasses: true,
        reflects: true,
        look: 'A small pond of water',
        image: { x: 9, y: 0 },
        light: undefined,
        color: 'rgb(84, 84, 255)',
        interact: undefined
    },
    WALL: {
        id: 4,
        entityPasses: false,
        lightPasses: false,
        reflects: false,
        look: 'The dungeon wall',
        image: { x: 2, y: 0 },
        light: undefined,
        color: 'rgb(162, 162, 162)',
        interact: undefined
    },
    PILLAR: {
        id: 5,
        entityPasses: false,
        lightPasses: false,
        reflects: true,
        look: 'A large pillar',
        image: { x: 2, y: 0 },
        light: undefined,
        color: 'rgb(68, 68, 68)',
        interact: undefined
    },
    DOOR: {
        id: 6,
        entityPasses: false,
        lightPasses: false,
        reflects: false,
        look: 'A closed door',
        image: { x: 3, y: 0 },
        light: undefined,
        color: 'rgb(162, 162, 162)',
        interact: function(x, y, game) {
            'use strict';
            game.dungeon.levels[game.level].cells[x][y] = Tile.DOOR_OPEN;
            return true;
        }
    },
    DOOR_OPEN: {
        id: 7,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'An open door',
        image: { x: 4, y: 0 },
        light: undefined,
        color: 'rgb(68, 68, 68)',
        interact: undefined
    },
    UPWARD_STAIRCASE: {
        id: 8,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'A staircase leading up',
        image: { x: 5, y: 0 },
        light: undefined,
        color: 'rgb(162, 162, 162)',
        interact: function(x, y, game) {
            'use strict';
            // Generate a new level
            game.level -= 1;

            // Move the player to the center
            game.player.x = game.dungeon.levels[game.level].endingPosition.x;
            game.player.y = game.dungeon.levels[game.level].endingPosition.y;

            // Reset the player path
            game.player.path = [];

            return false;
        }
    },
    DOWNWARD_STAIRCASE: {
        id: 9,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'A staircase leading down',
        image: { x: 6, y: 0 },
        light: undefined,
        color: 'rgb(162, 162, 162)',
        interact: function(x, y, game) {
            'use strict';
            // Generate a new level
            game.level += 1;

            // Remove all lights
            if(game.dungeon.levels[game.level] === undefined) {
                game.lighting._lights = {};
                game.dungeon.generate(game);
            }

            // Move the player to the center
            game.player.x = game.dungeon.levels[game.level].startingPosition.x;
            game.player.y = game.dungeon.levels[game.level].startingPosition.y;

            // Reset the player path
            game.player.path = [];

            return false;
        }
    },
    ENTRANCE: {
        id: 10,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'A staircase leading out of the dungeon',
        image: { x: 5, y: 0 },
        light: undefined,
        color: 'rgb(162, 162, 162)',
        interact: undefined
    },
    COCA_PLANT: {
        id: 11,
        entityPasses: false,
        lightPasses: true,
        reflects: true,
        look: 'A plant with large lightgreen leaves',
        image: { x: 7, y: 0 },
        light: undefined,
        color: 'rgb(34, 122, 48)',
        interact: function(x, y, game) {
            'use strict';
            // Replace this with foilage and place x coca thingies in the players inventory
            return true;
        }
    },
    OPIUM_PLANT: {
        id: 12,
        entityPasses: false,
        lightPasses: true,
        reflects: true,
        look: 'A plant carrying a large poppy',
        image: { x: 7, y: 0 },
        light: undefined,
        color: 'rgb(21, 93, 32)',
        interact: function(x, y, game) {
            'use strict';
            // Replace this with foilage and place 1 opium poppy in the players inventory
            return true;
        }
    },
    WELL: {
        id: 13,
        entityPasses: false,
        lightPasses: true,
        reflects: false,
        look: 'An untapped well',
        image: { x: 8, y: 0 },
        light: [138, 30, 81],
        color: 'rgb(138, 30, 81)',
        interact: function(x, y, game) {
            'use strict';
            game.dungeon.levels[game.level].cells[x][y] = Tile.WELL_EMPTY;
            game.lighting.setLight(x, y, null);
            return false;
        }
    },
    WELL_EMPTY: {
        id: 14,
        entityPasses: false,
        lightPasses: true,
        reflects: false,
        look: 'An empty well',
        image: { x: 8, y: 0 },
        light: undefined,
        color: 'rgb(104, 36, 68)',
        interact: undefined
    },
    ROOM_HIGHLIGHT: {
        id: 100,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'The dungeon floor',
        image: { x: 0, y: 0 },
        light: undefined,
        color: 'rgb(255, 255, 0)',
        interact: undefined
    },
    CELLULAR_HIGHLIGHT: {
        id: 101,
        entityPasses: true,
        lightPasses: true,
        reflects: true,
        look: 'The dungeon floor',
        image: { x: 0, y: 0 },
        light: undefined,
        color: 'rgb(255, 0, 255)',
        interact: undefined
    }
};
