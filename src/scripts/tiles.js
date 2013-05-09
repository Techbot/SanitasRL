// id:              the identifier of the tile type
// entityPasses:    whether an entity can move through the tile
// lightPasses:     whether light passes through the tile
// look:            the message displayed when the tile is described
// image:           the coordinates of the tile in the tileset (in 16x16 cells)
// color:           the color to blend the tile with
var Tile = {
    FLOOR:             0,
    WALL:              1,
    WATER:             2,
    STAIRS:            3,
    DOOR:              4,
    DOOR_OPEN:         5,
    SHRINE:            6,
    SHRINE_USED:       7,
    PILLAR:            8,
    BARS:              9,
    BLOOD:            10,
    BARS_DOOR:        11,
    BARS_DOOR_OPEN:   12,
    MONSTER_SPAWNER:  13,
    FIREBALL:         14,
    
    0: {
        id: 0,
        entityPasses: true,
        lightPasses: true,
        look: undefined,
        image: { x: 0, y: 0 },
        color: '#444'
    },
    1: {
        id: 1,
        entityPasses: false,
        lightPasses: false,
        look: 'A wall',
        image: { x: 1, y: 0 },
        color: '#a2a2a2'
    },
    2: {
        id: 2,
        entityPasses: false,
        lightPasses: true,
        look: 'Some water',
        image: { x: 3, y: 1 },
        color: '#175ba9'
    },
    3: {
        id: 3,
        entityPasses: true,
        lightPasses: true,
        look: 'A staircase leading down',
        image: { x: 3, y: 0 },
        color: '#a2a2a2'
    },
    4: {
        id: 4,
        entityPasses: true,
        lightPasses: false,
        look: 'A closed door',
        image: { x: 4, y: 0 },
        color: '#a2a2a2'
    },
    5: {
        id: 5,
        entityPasses: true,
        lightPasses: false,
        look:'An open door',
        image: { x: 6, y: 0 },
        color: '#444'
    },
    6: {
        id: 8,
        entityPasses: false,
        lightPasses: true,
        look: 'A water-filled well',
        image: { x: 1, y: 0 },
        color: '#8a1e51'
    },
    7: {
        id: 9,
        entityPasses: false,
        lightPasses: true,
        look: 'An empty well',
        image: { x: 1, y: 0 },
        color: '#682444'
    },
    8: {
        id: 10,
        entityPasses: false,
        lightPasses: true,
        look: 'A pillar reaching the ceiling',
        image: { x: 1, y: 0 },
        color: '#666'
    },
    9: {
        id: 11,
        entityPasses: false,
        lightPasses: true,
        look: 'Iron bars',
        image: { x: 2, y: 0 },
        color: '#a2a2a2'
    },
    10: {
        id: 14,
        entityPasses: true,
        lightPasses: true,
        look: 'A corpse',
        image: { x: 0, y: 0 },
        color: '#c00'
    },
    11: {
        id: 15,
        entityPasses: true,
        lightPasses: true,
        look: 'A closed iron bars door',
        image: { x: 4, y: 0 },
        color: '#a2a2a2'
    },
    12: {
        id: 23,
        entityPasses: true,
        lightPasses: true,
        look: 'An open iron bars door',
        image: { x: 6, y: 0 },
        color: '#444'
    },
    13: { // MAYBE OTHER TYPE?
        id: 16,
        entityPasses: true,
        lightPasses: true,
        look: 'A strange looking floor',
        image: { x: 0, y: 0 },
        color: '#a2a2a2'
    },
    14: {
        id: 30,
        entityPasses: true,
        lightPasses: true,
        look: 'A fire',
        image: { x: 0, y: 0 },
        color: '#ff7300'
    }
};
