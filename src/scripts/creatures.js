Creature.RAT = {
    image: {
        x: 1,
        y: 2,
        color: 'rgb(127, 127, 127)'
    },
    look: 'A rat',
    movementCost: 100,
    attackCost: 100
};

Creature.KOBOLD = {
    image: {
        x: 2,
        y: 2,
        color: '#664c33'
    },
    look: 'A kobold',
    movementCost: 100,
    attackCost: 100
};

Creature.JACKAL = {
    image: {
        x: 3,
        y: 2,
        color: '#996b44'
    },
    look: 'A jackal',
    movementCost: 50,
    attackCost: 100
};

Creature.MONKEY = {
    image: {
        x: 4,
        y: 2,
        color: '#993f3f'
    },
    look: 'A monkey',
    movementCost: 100,
    attackCost: 100
};

Creature.random = function(level) {
    var creatures = [ 'RAT', 'KOBOLD', 'JACKAL', 'MONKEY' ];
    var i = ROT.RNG.getInteger(0, 3);

    return Creature[creatures[i]];
};
