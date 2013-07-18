var Player = function(x, y) {
    'use strict';

    this.x = x;
    this.y = y;

    this.autopilot = false;
    this.path = [];
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

        $('.character-position').text('{ x: ' + x + ', y: ' + y + ' }');

        game.next();
    } else if(interacted === true) {
        game.next();
    }
};

Player.prototype.automove = function() {
    'use strict';

    if(this.path.length > 0) {
        var next = this.path.shift().split(',');
        var x = parseInt(next[0]);
        var y = parseInt(next[1]);
        
        if(game.dungeon.levels[game.level].cells[x][y].entityPasses === true) {
            game.player.x = x;
            game.player.y = y;
            
            game.next();
            // When monsters are implemented, this is the time to check if we should abort the autopilot
            // if any new interesting stuff came into view
            window.setTimeout(this.automove.bind(this), 50);
        } else {
            this.autopilot = false;
            this.path = [];
        }
    } else {
        this.autopilot = false;
    }
};
