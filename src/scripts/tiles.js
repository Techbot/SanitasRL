// id:              the identifier of the tile type
// solidPasses:     whether an entity can move through the tile
// lightPasses:     whether light passes through the tile
// look:            the message displayed when the tile is described
// image:           the coordinates of the tile in the tileset (in 16x16 cells)
// color:           the color to blend the tile with
var Tile = {
    FLOOR: {
        id: 0,
        solidPasses: true,
        lightPasses: true,
        look: undefined,
        image: { x: 0, y: 0 },
        color: '#444'
    },
    WALL: {
        id: 1,
        solidPasses: false,
        lightPasses: false,
        look: 'A wall',
        image: { x: 1, y: 0 },
        color: '#a2a2a2'
    },
    WATER: {
        id: 2,
        solidPasses: false,
        lightPasses: true,
        look: 'Some water',
        image: { x: 0, y: 0 },
        color: '#175ba9'
    },
    STAIRS: {
        id: 3,
        solidPasses: true,
        lightPasses: true,
        look: 'A staircase leading down',
        image: { x: 3, y: 0 },
        color: '#a2a2a2'
    },
    DOOR: {
        id: 4,
        solidPasses: true,
        lightPasses: false,
        look: 'A closed door',
        image: { x: 4, y: 0 },
        color: '#a2a2a2'
    },
    DOOR_OPEN: {
        id: 5,
        solidPasses: true,
        lightPasses: false,
        look:'An open door',
        image: { x: 6, y: 0 },
        color: '#444'
    },
    SHRINE: {
        id: 8,
        solidPasses: false,
        lightPasses: true,
        look: 'A water-filled well',
        image: { x: 1, y: 0 },
        color: '#8a1e51'
    },
    SHRINE_USED: {
        id: 9,
        solidPasses: false,
        lightPasses: true,
        look: 'An empty well',
        image: { x: 1, y: 0 },
        color: '#682444'
    },
    PILLAR: {
        id: 10,
        solidPasses: false,
        lightPasses: true,
        look: 'A pillar reaching the ceiling',
        image: { x: 1, y: 0 },
        color: '#666'
    },
    BARS: {
        id: 11,
        solidPasses: false,
        lightPasses: true,
        look: 'Iron bars',
        image: { x: 2, y: 0 },
        color: '#a2a2a2'
    },
    BLOOD_STAINED_FLOOR: {
        id: 14,
        solidPasses: true,
        lightPasses: true,
        look: 'A corpse',
        image: { x: 0, y: 0 },
        color: '#c00'
    },
    BARS_DOOR: {
        id: 15,
        solidPasses: true,
        lightPasses: true,
        look: 'A closed iron bars door',
        image: { x: 4, y: 0 },
        color: '#a2a2a2'
    },
    BARS_DOOR_OPEN: {
        id: 23,
        solidPasses: true,
        lightPasses: true,
        look: 'An open iron bars door',
        image: { x: 6, y: 0 },
        color: '#444'
    },
    MONSTER_SPAWNER: { // MAYBE OTHER TYPE?
        id: 16,
        solidPasses: true,
        lightPasses: true,
        look: 'A strange looking floor',
        image: { x: 0, y: 0 },
        color: '#a2a2a2'
    },
    FIREBALL: {
        id: 30,
        solidPasses: true,
        lightPasses: true,
        look: 'A fire',
        image: { x: 0, y: 0 },
        color: '#ff7300'
    }
};