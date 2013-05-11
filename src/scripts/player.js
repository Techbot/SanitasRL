var Player = function(x, y) {
    'use strict';

    this.x = x;
    this.y = y;
};

Player.prototype.move = function(direction, game) {
    'use strict';
    var x = game.player.x + ROT.DIRS['8'][direction][0],
        y = game.player.y + ROT.DIRS['8'][direction][1];

    if(game.dungeon.cells[x][y] !== null && game.dungeon.cells[x][y].id === Tile.DOOR.id) {
        game.dungeon.cells[x][y] = Tile.DOOR_OPEN;
    }

    if(game.dungeon.cells[x][y] !== null && game.dungeon.cells[x][y].entityPasses === true) {
        game.player.x = x;
        game.player.y = y;
        game.turn();
    }
};
