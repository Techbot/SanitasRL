var Creature = function(x, y, template) {
    'use strict';
    this.x = x;
    this.y = y;
    
    this.health = template.health;

    this.image = template.image;
    this.look = template.look;
    this.movementCost = template.movementCost;
    this.attackCost = template.attackCost;
};

Creature.prototype.act = function(game) {
    var direction = ROT.RNG.getInteger(0, 7),
        nx = this.x + ROT.DIRS['8'][direction][0],
        ny = this.y + ROT.DIRS['8'][direction][1];

    if(game.dungeon.levels[game.level].cells[nx][ny].entityPasses === true) {
        this.x = nx;
        this.y = ny;
    }

    return this.movementCost;
};
