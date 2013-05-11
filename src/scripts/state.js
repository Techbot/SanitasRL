var State = {
    WELCOME: {
        id: 0,
        render: false,
        input: function(key, game) {
            'use strict';
            switch(key) {
                // Enter - Go to PLAYER state
                case 'enter':
                    $('.window').fadeOut();
                    game.state = State.PLAYER;
                    break;
            }
        }
    },
    PLAYER: {
        id: 1,
        render: true,
        input: function(key, game) {
            'use strict';
            switch(key) {
                // Escape - Go to WELCOME state
                case 'escape':
                    $('.window').fadeIn();
                    game.state = State.WELCOME;
                    break;
                // x - Go to EXAMINE state
                case 'x':
                    game.state = State.EXAMINE;
                    game.cursor = { x: game.player.x, y: game.player.y };
                    break;
                // Numpad 8 / k - Move player north
                case 'numpad8':
                case 'k':
                    game.player.move(ROT.NORTH, game);
                    break;
                // Numpad 9 / u - Move player north east
                case 'numpad9':
                case 'u':
                    game.player.move(ROT.NORTH_EAST, game);
                    break;
                // Numpad 6 / l - Move player east
                case 'numpad6':
                case 'l':
                    game.player.move(ROT.EAST, game);
                    break;
                // Numpad 3 / n - Move player south east
                case 'numpad3':
                case 'n':
                    game.player.move(ROT.SOUTH_EAST, game);
                    break;
                // Numpad 2 / j - Move player south
                case 'numpad2':
                case 'j':
                    game.player.move(ROT.SOUTH, game);
                    break;
                // Numpad 1 / b - Move player south west
                case 'numpad1':
                case 'b':
                    game.player.move(ROT.SOUTH_WEST, game);
                    break;
                // Numpad 4 / h - Move player west
                case 'numpad4':
                case 'h':
                    game.player.move(ROT.WEST, game);
                    break;
                // Numpad 7 / y - Move player north west
                case 'numpad7':
                case 'k':
                    game.player.move(ROT.NORTH_WEST, game);
                    break;
                // Numpad 5 / . - Wait one turn
                case 'numpad5':
                case '.':
                    game.turn();
                    break;
                // q - Drink from nearby well
                case 'q':
                    if(game.dungeon.cells[game.player.x][game.player.y - 1].id === Tile.WELL.id) {
                        game.dungeon.cells[game.player.x][game.player.y - 1] = Tile.WELL_EMPTY;
                        game.turn();
                    } else if(game.dungeon.cells[game.player.x + 1][game.player.y].id === Tile.WELL.id) {
                        game.dungeon.cells[game.player.x + 1][game.player.y] = Tile.WELL_EMPTY;
                        game.turn();
                    } else if(game.dungeon.cells[game.player.x][game.player.y + 1].id === Tile.WELL.id) {
                        game.dungeon.cells[game.player.x][game.player.y + 1] = Tile.WELL_EMPTY;
                        game.turn();
                    } else if(game.dungeon.cells[game.player.x - 1][game.player.y].id === Tile.WELL.id) {
                        game.dungeon.cells[game.player.x - 1][game.player.y] = Tile.WELL_EMPTY;
                        game.turn();
                    }
                    break;
                // > - Descend a downward staircase
                case '>':
                    if(game.dungeon.cells[game.player.x][game.player.y].id === Tile.DOWNWARD_STAIRCASE.id) {
                        // Generate a new level
                        game.dungeon.level += 1;
                        game.dungeon.generate();
                        
                        // Move the player to the center
                        newPosition.x = Math.floor(game.dungeon.width / 2);
                        newPosition.y = Math.floor(game.dungeon.height / 2);
                        
                        // UPDATE THE TURN COUNTER
                        game.turn();
                    }
                    break;
            }
        }
    },
    EXAMINE: {
        id: 2,
        render: true,
        input: function(key, game) {
            'use strict';
            switch(key) {
                // Escape or x - Go to PLAYER state
                case 'escape':
                case 'x':
                    game.state = State.PLAYER;
                    game.cursor = undefined;
                    break;
                // Numpad 8 / k - Move cursor north
                case 'numpad8':
                case 'k':
                    game.cursor.y -= 1;
                    break;
                // Numpad 9 / u - Move cursor north east
                case 'numpad9':
                case 'u':
                    game.cursor.x += 1;
                    game.cursor.y -= 1;
                    break;
                // Numpad 6 / l - Move cursor east
                case 'numpad6':
                case 'l':
                    game.cursor.x += 1;
                    break;
                // Numpad 3 / n - Move cursor south east
                case 'numpad3':
                case 'n':
                    game.cursor.x += 1;
                    game.cursor.y += 1;
                    break;
                // Numpad 2 / j - Move cursor south
                case 'numpad2':
                case 'j':
                    game.cursor.y += 1;
                    break;
                // Numpad 1 / b - Move cursor south west
                case 'numpad1':
                case 'b':
                    game.cursor.x -= 1;
                    game.cursor.y += 1;
                    break;
                // Numpad 4 / h - Move cursor west
                case 'numpad4':
                case 'h':
                    game.cursor.x -= 1;
                    break;
                // Numpad 7 / y - Move cursor north west
                case 'numpad7':
                case 'k':
                    game.cursor.x -= 1;
                    game.cursor.y -= 1;
                    break;
            }
        }
    }
};































