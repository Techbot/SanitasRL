// id:              the identifier of the tile type
// entityPasses:    whether an entity can move through the tile
// lightPasses:     whether light passes through the tile
// look:            the message displayed when the tile is described
// image:           the coordinates of the tile in the tileset (in 16x16 cells)
// color:           the color to blend the tile with
var Tile = {
    FLOOR: {
        id: 0,
        entityPasses: true,
        lightPasses: true,
        look: undefined,
        image: { x: 0, y: 0 },
        color: '#444'
    },
    WALL: {
        id: 1,
        entityPasses: false,
        lightPasses: false,
        look: 'A wall',
        image: { x: 5, y: 0 },
        color: '#a2a2a2'
    },
    WATER: {
        id: 2,
        entityPasses: false,
        lightPasses: true,
        look: 'Some water',
        image: { x: 4, y: 0 },
        color: '#175ba9'
    },
    STAIRS: {
        id: 3,
        entityPasses: true,
        lightPasses: true,
        look: 'A staircase leading down',
        image: { x: 9, y: 0 },
        color: '#a2a2a2'
    },
    DOOR: {
        id: 4,
        entityPasses: true,
        lightPasses: false,
        look: 'A closed door',
        image: { x: 6, y: 0 },
        color: '#a2a2a2'
    },
    DOOR_OPEN: {
        id: 5,
        entityPasses: true,
        lightPasses: false,
        look:'An open door',
        image: { x: 7, y: 0 },
        color: '#444'
    },
    SHRINE: {
        id: 6,
        entityPasses: false,
        lightPasses: true,
        look: 'A water-filled well',
        image: { x: 3, y: 0 },
        color: '#8a1e51'
    },
    SHRINE_USED: {
        id: 7,
        entityPasses: false,
        lightPasses: true,
        look: 'An empty well',
        image: { x: 3, y: 0 },
        color: '#682444'
    },
    PILLAR: {
        id: 8,
        entityPasses: false,
        lightPasses: true,
        look: 'A pillar reaching the ceiling',
        image: { x: 2, y: 0 },
        color: '#666'
    },
    CORPSE: {
        id: 9,
        entityPasses: true,
        lightPasses: true,
        look: 'A corpse',
        image: { x: 2, y: 0 },
        color: '#c00'
    },
    GRASS: {
        id: 10,
        entityPasses: true,
        lightPasses: true,
        look: 'Some grass',
        image: { x: 1, y: 0 },
        color: '#293b22'
    }
};
