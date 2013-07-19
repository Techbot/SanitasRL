var State = {
    WELCOME: {
        id: 0,
        render: false,
        input: function(key, e, game) {
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
        input: function(key, e, game) {
            'use strict';
            switch(key) {
                // Escape - Go to WELCOME state
                case 'escape':
                    $('.window').fadeIn();
                    game.state = State.WELCOME;
                    break;
                // x / Enter - Go to CURSOR state
                case 'x':
                case 'enter':
                    game.state = State.CURSOR;
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
                case 'y':
                    game.player.move(ROT.NORTH_WEST, game);
                    break;
                // Numpad 5 / . - Wait one turn
                case 'numpad5':
                case '.':
                    game.next();
                    break;
                case 'mousemove':
                    var previous = $.extend({}, game.cursor);
                    game.cursor.x = Math.floor(e.offsetX / 16);
                    game.cursor.y = Math.floor(e.offsetY / 16);

                    // Only do stuff if the mouse has actually moved a tile and not just a couple of pixels
                    if(previous.x !== game.cursor.x || previous.y !== game.cursor.y) {
                        game.mouselook = true; // Allow the player to examine with the mouse
                        game.updateInterface();
                    
                        // Only calculate a path if the autopilot is off (we're not traversing a path right now)
                        if(game.player.autopilot === false) {
                            game.player.path = [];

                            // Only calculate a path if we've seen this cell
                            if(game.dungeon.levels[game.level].explored[game.cursor.x][game.cursor.y]) {
                                game.player.path = game.calculatePath(game.player.x, game.player.y, game.cursor.x, game.cursor.y);
                                // Remove the top position since this is the players current position
                                game.player.path.shift();
                            }
                        }
                    }
                    break;
                case 'mouseclick':
                    // Start the player's autopilot following the computed path
                    if(game.player.path.length > 0) {
                        game.player.automove(game);
                        game.state = State.AUTOPILOT;
                    }
                    break;
            }
        }
    },
    CURSOR: {
        id: 2,
        render: true,
        input: function(key, e, game) {
            'use strict';
            switch(key) {
                // Escape / x - Go to PLAYER state
                case 'escape':
                case 'x':
                    game.player.path = [];
                    game.state = State.PLAYER;
                    game.cursor = { x: undefined, y: undefined };
                    break;
                // Enter - Autopilot
                case 'enter':
                    // Start the player's autopilot following the computed path
                    game.player.automove(game);
                    game.state = State.AUTOPILOT;
                    game.cursor = { x: undefined, y: undefined };
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
                case 'y':
                    game.cursor.x -= 1;
                    game.cursor.y -= 1;
                    break;
            }
        }
    },
    AUTOPILOT: {
        id: 3,
        render: true,
        input: function(key, e, game) {
            'use strict';
            switch(key) {
                case 'escape':
                    game.state = State.PLAYER;
                    game.player.autopilot = false;
                    game.player.path = [];
                    break;
            }
        }
    }
};
