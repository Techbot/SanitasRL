var Tile = {
    FLOOR: {
        id: 0,
        entityPasses: true,
        lightPasses: true,
        look: 'The dungeon floor',
        image: { x: 0, y: 0 },
        color: '#444',
        interact: undefined
    },
    GRASS: {
        id: 1,
        entityPasses: true,
        lightPasses: true,
        look: 'Some grass',
        image: { x: 0, y: 0 },
        color: '#227a30',
        interact: undefined
    },
    FOILAGE: {
        id: 2,
        entityPasses: true,
        lightPasses: true,
        look: 'Some foilage',
        image: { x: 1, y: 0 },
        color: '#227a30',
        interact: undefined
    },
    WATER: {
        id: 3,
        entityPasses: false,
        lightPasses: true,
        look: 'A hole with dirty water',
        image: { x: 9, y: 0 },
        color: '#5454ff',
        interact: undefined
    },
    WALL: {
        id: 4,
        entityPasses: false,
        lightPasses: false,
        look: 'The dungeon wall',
        image: { x: 2, y: 0 },
        color: '#a2a2a2',
        interact: undefined
    },
    PILLAR: {
        id: 5,
        entityPasses: false,
        lightPasses: false,
        look: 'A large pillar',
        image: { x: 2, y: 0 },
        color: '#444',
        interact: undefined
    },
    DOOR: {
        id: 6,
        entityPasses: false,
        lightPasses: false,
        look: 'A closed door',
        image: { x: 3, y: 0 },
        color: '#a2a2a2',
        interact: function(x, y, game) {
            'use strict';
            game.dungeon.cells[x][y] = Tile.DOOR_OPEN;
            return true;
        }
    },
    DOOR_OPEN: {
        id: 7,
        entityPasses: true,
        lightPasses: true,
        look: 'An open door',
        image: { x: 4, y: 0 },
        color: '#444',
        interact: undefined
    },
    UPWARD_STAIRCASE: {
        id: 8,
        entityPasses: true,
        lightPasses: true,
        look: 'A staircase leading up',
        image: { x: 5, y: 0 },
        color: '#a2a2a2',
        interact: function(x, y, game) {
            'use strict';
            // Generate a new level
            //game.dungeon.level += 1;
            //game.dungeon.generate();

            // Move the player to the center
            //game.player.x = Math.floor(game.dungeon.width / 2);
            //game.player.y = Math.floor(game.dungeon.height / 2);

            // UPDATE THE TURN COUNTER
            //game.turn();
            return true;
        }
    },
    DOWNWARD_STAIRCASE: {
        id: 9,
        entityPasses: true,
        lightPasses: true,
        look: 'A staircase leading down',
        image: { x: 6, y: 0 },
        color: '#a2a2a2',
        interact: function(x, y, game) {
            'use strict';
            // Generate a new level
            game.dungeon.level += 1;
            game.dungeon.generate();

            // Move the player to the center
            game.player.x = Math.floor(game.dungeon.width / 2);
            game.player.y = Math.floor(game.dungeon.height / 2);

            // UPDATE THE TURN COUNTER
            game.turn();
            return true;
        }
    },
    COCA_PLANT: {
        id: 10,
        entityPasses: false,
        lightPasses: true,
        look: 'A plant with large lightgreen leaves',
        image: { x: 7, y: 0 },
        color: '#227a30',
        interact: function(x, y, game) {
            'use strict';
            // Replace this with foilage and place x coca thingies in the players inventory
            return true;
        }
    },
    OPIUM_PLANT: {
        id: 11,
        entityPasses: false,
        lightPasses: true,
        look: 'A plant carrying a large poppy',
        image: { x: 7, y: 0 },
        color: '#155d20',
        interact: function(x, y, game) {
            'use strict';
            // Replace this with foilage and place 1 opium poppy in the players inventory
            return true;
        }
    },
    PSILOCYBIN_MUSHROOM: {
        id: 12,
        entityPasses: true,
        lightPasses: true,
        look: 'A small brown mushroom',
        image: { x: 7, y: 0 },
        color: '#644a11',
        interact: function(x, y, game) {
            'use strict';
            // Replace this with foilage(?) and place x psilocybin mushrooms in the players inventory
            return true;
        }
    },
    WELL: {
        id: 13,
        entityPasses: false,
        lightPasses: true,
        look: 'An untapped well',
        image: { x: 8, y: 0 },
        color: '#8a1e51',
        interact: function(x, y, game) {
            'use strict';
            game.dungeon.cells[x][y] = Tile.WELL_EMPTY;
            return false;
        }
    },
    WELL_EMPTY: {
        id: 14,
        entityPasses: false,
        lightPasses: true,
        look: 'An empty well',
        image: { x: 8, y: 0 },
        color: '#682444',
        interact: undefined
    }
};
