var Player = function(x, y) {
    'use strict';

    this.x = x;
    this.y = y;
};

Player.prototype.move = function(direction, game) {
    'use strict';
    var x = game.player.x + ROT.DIRS['8'][direction][0],
        y = game.player.y + ROT.DIRS['8'][direction][1];

    var interacted = false, canMoveAfterInteraction = true;
    if(game.dungeon.levels[game.level].cells[x][y].interact !== undefined) {
        canMoveAfterInteraction = game.dungeon.levels[game.level].cells[x][y].interact(x, y, game);
        interacted = true;
    }
    
    if(canMoveAfterInteraction === true && game.dungeon.levels[game.level].cells[x][y].entityPasses === true) {
        game.player.x = x;
        game.player.y = y;
        game.next();
    } else if(interacted === true) {
        game.next();
    }
};
