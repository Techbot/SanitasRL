var Tile = {
    FLOOR: {
        id: 0,
        entityPasses: true,
        lightPasses: true,
        look: 'The dungeon floor',
        image: { x: 0, y: 0 },
        color: '#444'
    },
    GRASS: {
        id: 1,
        entityPasses: true,
        lightPasses: true,
        look: 'Some grass',
        image: { x: 0, y: 0 },
        color: '#227a30'
    },
    FOILAGE: {
        id: 2,
        entityPasses: true,
        lightPasses: true,
        look: 'Some foilage',
        image: { x: 1, y: 0 },
        color: '#227a30'
    },
    WATER: {
        id: 3,
        entityPasses: false,
        lightPasses: true,
        look: 'A hole with dirty water',
        image: { x: 9, y: 0 },
        color: '#5454ff'
    },
    WALL: {
        id: 4,
        entityPasses: false,
        lightPasses: false,
        look: 'The dungeon wall',
        image: { x: 2, y: 0 },
        color: '#a2a2a2'
    },
    PILLAR: {
        id: 5,
        entityPasses: false,
        lightPasses: false,
        look: 'A large pillar',
        image: { x: 2, y: 0 },
        color: '#444'
    },
    DOOR: {
        id: 6,
        entityPasses: false,
        lightPasses: false,
        look: 'A closed door',
        image: { x: 3, y: 0 },
        color: '#a2a2a2'
    },
    DOOR_OPEN: {
        id: 7,
        entityPasses: true,
        lightPasses: true,
        look: 'An open door',
        image: { x: 4, y: 0 },
        color: '#444'
    },
    UPWARD_STAIRCASE: {
        id: 8,
        entityPasses: true,
        lightPasses: true,
        look: 'A staircase leading up',
        image: { x: 5, y: 0 },
        color: '#a2a2a2'
    },
    DOWNWARD_STAIRCASE: {
        id: 9,
        entityPasses: true,
        lightPasses: true,
        look: 'A staircase leading down',
        image: { x: 6, y: 0 },
        color: '#a2a2a2'
    },
    COCA_PLANT: {
        id: 10,
        entityPasses: false,
        lightPasses: true,
        look: 'A plant with large lightgreen leaves',
        image: { x: 7, y: 0 },
        color: '#227a30'
    },
    OPIUM_PLANT: {
        id: 11,
        entityPasses: false,
        lightPasses: true,
        look: 'A plant carrying a large poppy',
        image: { x: 7, y: 0 },
        color: '#155d20'
    },
    PSILOCYBIN_MUSHROOM: {
        id: 12,
        entityPasses: true,
        lightPasses: true,
        look: 'A small brown mushroom',
        image: { x: 7, y: 0 },
        color: '#644a11'
    },
    WELL: {
        id: 13,
        entityPasses: false,
        lightPasses: true,
        look: 'An untapped well',
        image: { x: 8, y: 0 },
        color: '#8a1e51'
    },
    WELL_EMPTY: {
        id: 14,
        entityPasses: false,
        lightPasses: true,
        look: 'An empty well',
        image: { x: 8, y: 0 },
        color: '#682444'
    }
};
