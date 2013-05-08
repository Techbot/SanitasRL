// id:              the identifier of the tile type
// solid:           whether an entity can move through the tile
// transparent:     whether light passes through the tile
// look:            the message displayed when the tile is described
// image:           the coordinates of the tile in the tileset (in 16x16 cells)
// color:           the color to blend the tile with
var Tile = {
    FLOOR: {
        id: 0,
        solid: false,
        transparent: true,
        look: undefined,
        image: { x: 0, y: 0 },
        color: '#444'
    },
    WALL: {
        id: 1,
        solid: true,
        transparent: false,
        look: 'A wall',
        image: { x: 1, y: 0 },
        color: '#a2a2a2'
    },
    WATER: {
        id: 2,
        solid: true,
        transparent: true,
        look: 'Some water',
        image: { x: 0, y: 0 },
        color: '#175ba9'
    },
    STAIRS: {
        id: 3,
        solid: false,
        transparent: true,
        look: 'A staircase leading down',
        image: { x: 3, y: 0 },
        color: '#a2a2a2'
    },
    DOOR: {
        id: 4,
        solid: false,
        transparent: false,
        look: 'A closed door',
        image: { x: 4, y: 0 },
        color: '#a2a2a2'
    },
    DOOR_OPEN: {
        id: 5,
        solid: false,
        transparent: false,
        look:'An open door',
        image: { x: 6, y: 0 },
        color: '#444'
    },
    SHRINE: {
        id: 8,
        solid: true,
        transparent: true,
        look: 'A water-filled well',
        image: { x: 1, y: 0 },
        color: '#8a1e51'
    },
    SHRINE_USED: {
        id: 9,
        solid: true,
        transparent: true,
        look: 'An empty well',
        image: { x: 1, y: 0 },
        color: '#682444'
    },
    PILLAR: {
        id: 10,
        solid: true,
        transparent: true,
        look: 'A pillar reaching the ceiling',
        image: { x: 1, y: 0 },
        color: '#666'
    },
    BARS: {
        id: 11,
        solid: true,
        transparent: true,
        look: 'Iron bars',
        image: { x: 2, y: 0 },
        color: '#a2a2a2'
    },
    BLOOD_STAINED_FLOOR: {
        id: 14,
        solid: false,
        transparent: true,
        look: 'A corpse',
        image: { x: 0, y: 0 },
        color: '#c00'
    },
    BARS_DOOR: {
        id: 15,
        solid: false,
        transparent: true,
        look: 'A closed iron bars door',
        image: { x: 4, y: 0 },
        color: '#a2a2a2'
    },
    BARS_DOOR_OPEN: {
        id: 23,
        solid: false,
        transparent: true,
        look: 'An open iron bars door',
        image: { x: 6, y: 0 },
        color: '#444'
    },
    MONSTER_SPAWNER: { // MAYBE OTHER TYPE?
        id: 16,
        solid: false,
        transparent: true,
        look: 'A strange looking floor',
        image: { x: 0, y: 0 },
        color: '#a2a2a2'
    },
    FIREBALL: {
        id: 30,
        solid: false,
        transparent: true,
        look: 'A fire',
        image: { x: 0, y: 0 },
        color: '#ff7300'
    }
};