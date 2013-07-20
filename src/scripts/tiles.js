var Tile = {
    EMPTY: {
        id: -1,
        entityPasses: false,
        autopilotPasses: false,
        lightPasses: false,
        reflects: false,
        spawnable: false,
        look: undefined,
        image: undefined,
        light: undefined,
        color: undefined,
        interact: undefined
    },
    FLOOR: {
        id: 0,
        entityPasses: true,
        autopilotPasses: true,
        lightPasses: true,
        reflects: true,
        spawnable: true,
        look: 'The dungeon floor',
        image: { x: 0, y: 0 },
        light: undefined,
        color: 'rgb(68, 68, 68)',
        interact: undefined
    },
    GRASS: {
        id: 1,
        entityPasses: true,
        autopilotPasses: true,
        lightPasses: true,
        reflects: true,
        spawnable: true,
        look: 'Some grass',
        image: { x: 0, y: 0 },
        light: undefined,
        color: 'rgb(34, 122, 48)',
        interact: undefined
    },
    FOILAGE: {
        id: 2,
        entityPasses: true,
        autopilotPasses: true,
        lightPasses: true,
        reflects: true,
        spawnable: true,
        look: 'Some foilage',
        image: { x: 1, y: 0 },
        light: undefined,
        color: 'rgb(34, 122, 48)',
        interact: undefined
    },
    WATER: {
        id: 3,
        entityPasses: false,
        autopilotPasses: false,
        lightPasses: true,
        reflects: true,
        spawnable: false,
        look: 'A small pond of water',
        image: { x: 9, y: 0 },
        light: undefined,
        color: 'rgb(84, 84, 255)',
        interact: undefined
    },
    WALL: {
        id: 4,
        entityPasses: false,
        autopilotPasses: false,
        lightPasses: false,
        reflects: false,
        spawnable: false,
        look: 'The dungeon wall',
        image: { x: 2, y: 0 },
        light: undefined,
        color: 'rgb(162, 162, 162)',
        interact: undefined
    },
    PILLAR: {
        id: 5,
        entityPasses: false,
        autopilotPasses: false,
        lightPasses: false,
        reflects: true,
        spawnable: false,
        look: 'A large pillar',
        image: { x: 2, y: 0 },
        light: undefined,
        color: 'rgb(68, 68, 68)',
        interact: undefined
    },
    DOOR: {
        id: 6,
        entityPasses: false,
        autopilotPasses: true,
        lightPasses: false,
        reflects: false,
        spawnable: false,
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
        autopilotPasses: true,
        lightPasses: true,
        reflects: true,
        spawnable: false,
        look: 'An open door',
        image: { x: 4, y: 0 },
        light: undefined,
        color: 'rgb(68, 68, 68)',
        interact: undefined
    },
    UPWARD_STAIRCASE: {
        id: 8,
        entityPasses: true,
        autopilotPasses: false,
        lightPasses: true,
        reflects: true,
        spawnable: false,
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
            game.autopilot = false;
            game.player.path = [];

            return false;
        }
    },
    DOWNWARD_STAIRCASE: {
        id: 9,
        entityPasses: true,
        autopilotPasses: false,
        lightPasses: true,
        reflects: true,
        spawnable: false,
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
            game.autopilot = false;
            game.player.path = [];

            return false;
        }
    },
    ENTRANCE: {
        id: 10,
        entityPasses: true,
        autopilotPasses: true,
        lightPasses: true,
        reflects: true,
        spawnable: false,
        look: 'A staircase leading out of the dungeon',
        image: { x: 5, y: 0 },
        light: undefined,
        color: 'rgb(162, 162, 162)',
        interact: undefined
    },
    COCA_PLANT: {
        id: 11,
        entityPasses: false,
        autopilotPasses: false,
        lightPasses: true,
        reflects: true,
        spawnable: false,
        look: 'A plant with large lightgreen leaves',
        image: { x: 7, y: 0 },
        light: undefined,
        color: 'rgb(34, 122, 48)',
        interact: function(x, y, game) {
            'use strict';
            // Replace this with foilage and place x coca leafs in the players inventory
            game.dungeon.levels[game.level].cells[x][y] = Tile.FOILAGE;
            game.player.inventory.add(Item.COCA_LEAF, 3);
            return false;
        }
    },
    OPIUM_PLANT: {
        id: 12,
        entityPasses: false,
        autopilotPasses: false,
        lightPasses: true,
        reflects: true,
        spawnable: false,
        look: 'A plant carrying a large poppy',
        image: { x: 7, y: 0 },
        light: undefined,
        color: 'rgb(21, 93, 32)',
        interact: function(x, y, game) {
            'use strict';
            // Replace this with foilage and place 1 opium poppy in the players inventory
            game.dungeon.levels[game.level].cells[x][y] = Tile.FOILAGE;
            game.player.inventory.add(Item.OPIUM_POPPY, 1);
            return false;
        }
    },
    WELL: {
        id: 13,
        entityPasses: false,
        autopilotPasses: false,
        lightPasses: true,
        reflects: false,
        spawnable: false,
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
        autopilotPasses: false,
        lightPasses: true,
        reflects: false,
        spawnable: false,
        look: 'An empty well',
        image: { x: 8, y: 0 },
        light: undefined,
        color: 'rgb(104, 36, 68)',
        interact: undefined
    },
    // The following ones are only for debugging pruposes
    ROOM_HIGHLIGHT: {
        id: 100,
        entityPasses: true,
        autopilotPasses: true,
        lightPasses: true,
        reflects: true,
        spawnable: true,
        look: 'The dungeon floor',
        image: { x: 0, y: 0 },
        light: undefined,
        color: 'rgb(255, 255, 0)',
        interact: undefined
    },
    CELLULAR_HIGHLIGHT: {
        id: 101,
        entityPasses: true,
        autopilotPasses: true,
        lightPasses: true,
        reflects: true,
        spawnable: true,
        look: 'The dungeon floor',
        image: { x: 0, y: 0 },
        light: undefined,
        color: 'rgb(255, 0, 255)',
        interact: undefined
    }
};
