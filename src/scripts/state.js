var State = {
    WELCOME: {
        id: 0,
        name: 'WELCOME',
        render: false,
        input: function(key, e, game) {
            'use strict';
            switch(key) {
                default:
                    $('.window.welcome').hide();
                    game.state = State.PLAYER;
                    break;
            }
        },
        construct: function(game) {
            $('.window.welcome').show();
        }
    },
    PLAYER: {
        id: 1,
        name: 'PLAYER',
        render: true,
        input: function(key, e, game) {
            'use strict';
            switch(key) {
                // ? - Open help screen
                case '?':
                    State.HELP.construct();
                    game.state = State.HELP;
                    break;
                // Enter - Go to cursor mode
                case 'enter':
                    game.state = State.CURSOR;
                    game.cursor = { x: game.player.x, y: game.player.y };
                    break;
                // Numpad 8 / k - Move player north
                case 'numpad8':
                case 'k':
                    game.player.move(ROT.NORTH, game);
                    break;
                // Shift + Numpad 8 / K - Automove player north
                case 'up':
                case 'K':
                    if(e.shiftKey) {
                        game.player.shiftMove(ROT.NORTH, game);
                    } else {
                        game.player.move(ROT.NORTH, game);
                    }
                    break;
                // Numpad 9 / u - Move player north east
                case 'numpad9':
                case 'u':
                    game.player.move(ROT.NORTH_EAST, game);
                    break;
                // Shift + Numpad 9 / U - Automove player north east
                case 'pageup':
                case 'U':
                    game.player.shiftMove(ROT.NORTH_EAST, game);
                    break;
                // Numpad 6 / l - Move player east
                case 'numpad6':
                case 'l':
                    game.player.move(ROT.EAST, game);
                    break;
                // Shift + Numpad 6 / L - Automove player east
                case 'right':
                case 'L':
                    if(e.shiftKey) {
                        game.player.shiftMove(ROT.EAST, game);
                    } else {
                        game.player.move(ROT.EAST, game);
                    }
                    break;
                // Numpad 3 / n - Move player south east
                case 'numpad3':
                case 'n':
                    game.player.move(ROT.SOUTH_EAST, game);
                    break;
                // Shift + Numpad 3 / N - Automove player south east
                case 'pagedown':
                case 'N':
                    game.player.shiftMove(ROT.SOUTH_EAST, game);
                    break;
                // Numpad 2 / j - Move player south
                case 'numpad2':
                case 'j':
                    game.player.move(ROT.SOUTH, game);
                    break;
                // Shift + Numpad 2 / J - Automove player south
                case 'down':
                case 'J':
                    if(e.shiftKey) {
                        game.player.shiftMove(ROT.SOUTH, game);
                    } else {
                        game.player.move(ROT.SOUTH, game);
                    }
                    break;
                // Numpad 1 / b - Move player south west
                case 'numpad1':
                case 'b':
                    game.player.move(ROT.SOUTH_WEST, game);
                    break;
                // Shift + Numpad 1 / B - Automove player south west
                case 'end':
                case 'B':
                    game.player.shiftMove(ROT.SOUTH_WEST, game);
                    break;
                // Numpad 4 / h - Move player west
                case 'numpad4':
                case 'h':
                    game.player.move(ROT.WEST, game);
                    break;
                // Shift + Numpad 4 / H - Automove player west
                case 'left':
                case 'H':
                    if(e.shiftKey) {
                        game.player.shiftMove(ROT.WEST, game);
                    } else {
                        game.player.move(ROT.WEST, game);
                    }
                    break;
                // Numpad 7 / y - Move player north west
                case 'numpad7':
                case 'y':
                    game.player.move(ROT.NORTH_WEST, game);
                    break;
                // Shift + Numpad 7 / Y - Automove player north west
                case 'home':
                case 'Y':
                    game.player.shiftMove(ROT.NORTH_WEST, game);
                    break;
                // Numpad 5 / . - Wait one turn
                case 'numpad5':
                case '.':
                    game.next(100); // Wait for 100 ticks
                    break;
                // i - Open inventory
                case 'i':
                    State.INVENTORY.previousState = game.state;
                    State.INVENTORY.construct(game);
                    game.state = State.INVENTORY;
                    break;
                // mousemove - Update the autopilot path
                case 'mousemove':
                    var previous = $.extend({}, game.cursor);
                    game.cursor.x = Math.floor(e.offsetX / 16);
                    game.cursor.y = Math.floor(e.offsetY / 16);

                    // Only do stuff if the mouse has actually moved a tile and not just a couple of pixels
                    if(previous.x !== game.cursor.x || previous.y !== game.cursor.y) {
                        game.updateInterface();

                        // Only calculate a path if the autopilot is off (we're not traversing a path right now)
                        if(game.player.autopilot === false) {
                            game.player.path = [];

                            // Only calculate a path if we've seen this cell
                            if(game.dungeon.levels[game.level].explored[game.cursor.x][game.cursor.y] || game.debug === true) {
                                game.player.path = game.calculatePath(game.player.x, game.player.y, game.cursor.x, game.cursor.y);
                                // Remove the top position since this is the players current position
                                game.player.path.shift();
                            }
                        }
                    }
                    break;
                // mouseclick - Follow the autopilot path
                case 'mouseclick':
                    // Start the player's autopilot following the computed path
                    if(game.player.path.length > 0) {
                        game.state = State.AUTOPILOT;
                        game.player.automove(game);
                    }
                    break;
                // mouseleave - Remove the cursor
                case 'mouseleave':
                    game.cursor = { x: undefined, y: undefined };
                    break;
            }
        }
    },
    CURSOR: {
        id: 2,
        name: 'CURSOR',
        render: true,
        input: function(key, e, game) {
            'use strict';
            switch(key) {
                // Escape - Go to PLAYER state
                case 'escape':
                    game.player.path = [];
                    game.state = State.PLAYER;
                    game.cursor = { x: undefined, y: undefined };
                    break;
                // Enter - Autopilot
                case 'enter':
                    // Start the player's autopilot following the computed path
                    game.state = State.AUTOPILOT;
                    game.player.automove(game);
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
                // i - Open inventory
                case 'i':
                    State.INVENTORY.previousState = game.state;
                    State.INVENTORY.construct(game);
                    game.state = State.INVENTORY;
                    break;
            }
        }
    },
    AUTOPILOT: {
        id: 3,
        name: 'AUTOPILOT',
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
    },
    INVENTORY: {
        id: 4,
        name: 'INVENTORY',
        render: false,
        input: function(key, e, game) {
            'use strict';
            switch(key) {
                case 'i':
                case 'escape':
                    $('.window.inventory').hide();
                    game.state = this.previousState; // This should really revert to whatever state it was before
                    break;
                case 'd':
                    var str = '[ What item? (<span class="cyan">a</span> - <span class="cyan">z</span>)';
                    str = str.rpad(' ', 151);
                    str += ']';
                    
                    $('.window.inventory .bottom').html(str);
                    
                    this.action = 'drop';
                    break;
                case 'e':
                    var str = '[ What item? (<span class="cyan">a</span> - <span class="cyan">z</span>)';
                    str = str.rpad(' ', 151);
                    str += ']';
                    
                    $('.window.inventory .bottom').html(str);
                
                    this.action = 'use';
                    break;
                default:
                    if(this.az.indexOf(key) !== -1) {
                        var i = this.az.indexOf(key);
                        
                        switch(this.action) {
                            case 'drop':
                                game.player.inventory.items.splice(i, 1);
                                this.action = null;
                                break;
                            case 'use':
                                game.player.inventory.items[i].use(game, game.player.inventory.items[i]);
                                if(game.player.inventory.items[i].quantity <= 0) {
                                    game.player.inventory.items.splice(i, 1);
                                }
                                this.action = null;
                                break;
                        }
                        
                        
                        this.construct(game);
                    }
                    break;
            }
        },
        construct: function(game) {
            'use strict';

            var inventory = game.player.inventory.items;
            var window = $('.window.inventory');

            window.html('<p class="heading">============================================= INVENTORY ============================================</p>');
            
            if(inventory.length > 0) {
                for(var i = 0; i < inventory.length; i++) {
                    window.append('<span class="cyan">' + this.az[i] +'</span>) ' + inventory[i].name + ' (' + inventory[i].quantity + 'x)<br>');
                }
            } else {
                window.append('You have no items.');
            }

            var bottom = '[ <span class="cyan">d</span> - Drop, <span class="cyan">e</span> - Use';
            bottom = bottom.rpad(' ', 151);
            bottom += ']';
            
            window.append('<pre class="bottom">' + bottom + '</pre>');
            
            window.show();
        },
        previousState: null,
        az: [ 'a', 'b', 'c', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
        action: null
    },
    NONPLAYER: {
        id: 5,
        name: 'NONPLAYER',
        render: true,
        input: function(key, e, game) {
            'use strict';
        }
    },
    HELP: {
        id: 6,
        name: 'HELP',
        render: false,
        input: function(key, e, game) {
            'use strict';
            switch(key) {
                default:
                    if(key !== 'mousemove' && key !== 'mouseenter' && key !== 'mouseleave') {
                        $('.window.help').hide();
                        game.state = State.PLAYER;
                    }
                    break;
            }
        },
        construct: function(game) {
            $('.window.help').show();
        }
    }
};
