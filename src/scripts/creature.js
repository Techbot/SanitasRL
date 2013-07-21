var Creature = function(x, y) {
    'use strict';
    this.x = x;
    this.y = y;

    this.image = {
        x: 1,
        y: 2,
        color: 'rgb(204, 0, 0)'
    };
};

Creature.prototype.act = function(game) {
    var direction = ROT.RNG.getInteger(0, 7),
        nx = this.x + ROT.DIRS['8'][direction][0],
        ny = this.y + ROT.DIRS['8'][direction][1];

    if(game.dungeon.levels[game.level].cells[nx][ny].entityPasses === true) {
        this.x = nx;
        this.y = ny;
    }

    return 25;
};
