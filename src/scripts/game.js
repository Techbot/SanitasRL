var Game = function() {
    'use strict';

    // Request Animation Frame shortcut
    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    }());

    // Bind to the keydown and keypress events
    $(document).on('keydown', function(e) {
        var key = e.which + (e.ctrlKey ? 400 : (e.altKey ? 600 : 0));
        if(Keys.hasOwnProperty(key)) {
            this.input(Keys[key]);
            return false;
        }
    }.bind(this)).on('keypress', function(e) {
        if(Keys.hasOwnProperty(e.which + 200)) {
            this.input(Keys[e.which + 200]);
            return false;
        }
    }.bind(this));

    // Get the canvas context from the DOM
    this.canvas = document.getElementById('canvas').getContext('2d');

    this.initializeGamepad();
    this.gamepadTimer = new Date();
    this.controlScheme = 'keyboard'; // keyboard, gamepad, touch

    // The game state
    this.state = State.WELCOME;
    // The game turn
    this.turn = 0;
    // The dungeon level we're currently at
    this.level = 1;

    // Shadowcaster for field of view
    this.shadowcasting = new ROT.FOV.PreciseShadowcasting(function(x, y) {
        'use strict'; // needed?
        if(x > 0 && x < this.dungeon.width && y > 0 && y < this.dungeon.height && this.dungeon.levels[this.level].cells[x][y].id !== Tile.EMPTY.id) {
            return this.dungeon.levels[this.level].cells[x][y].lightPasses;
        }

        return false;
    }.bind(this));

    // Lighting
    this.lighting = new ROT.Lighting(undefined, { range: 4 });
    this.lighting.setFOV(this.shadowcasting);


    // Create the dungeon instance and generate a dungeon
    this.dungeon = new Dungeon();
    this.dungeon.generate(this);

    // Create the player instance
    this.player = new Player(this.dungeon.levels[this.level].startingPosition.x, this.dungeon.levels[this.level].startingPosition.y);
    this.cursor = undefined;

    /*** TEMPORARY fov AND light 2d-arrays ***/
    for(this.fov = []; this.fov.length < this.dungeon.width; this.fov.push([])); // generate a 2d array for field of view
    for(this.light = []; this.light.length < this.dungeon.width; this.light.push([])); // generate a 2d array for lighting
    /***                                   ***/

    // Update the field of view
    this.computeFOV(this.player.x, this.player.y);

    // Update the lighting
    this.computeLighting();

    // Pulsation for lighting
    this.pulseDir = true; // true = addition, false = subtraction
    this.pulse = 0;

    // Set the debug mode
    this.debug = false;
    if(this.debug === true) {
        $('.window').hide();
        $('.character-position').show();
        this.state = State.PLAYER;
    }

    // Load the tileset and begin to render when done
    this.tileset = new Image();
    this.tileset.onload = function() {
        this.render();
    }.bind(this);
    this.tileset.src = 'images/tileset.png';

    // Update the interface
    this.updateInterface();
};

Game.prototype.computeFOV = function(sx, sy) {
    var x, y;

    // Clear the FOV
    for(x = 0; x < this.dungeon.width; x += 1) {
        for(y = 0; y < this.dungeon.height; y += 1) {
            this.fov[x][y] = undefined;
        }
    }

    // Compute the new FOV
    this.shadowcasting.compute(sx, sy, 10, function(x, y, r, visibility) {
        this.fov[x][y] = (r === 0 ? 1 : (1 / r) * 3);
        this.dungeon.levels[this.level].explored[x][y] = true;
    }.bind(this));
};

Game.prototype.computeLighting = function() {
    var x, y;

    // CLear the light
    for(x = 0; x < this.dungeon.width; x += 1) {
        for(y = 0; y < this.dungeon.height; y += 1) {
            this.light[x][y] = undefined;
        }
    }

    // Compute the new light
    this.lighting.compute(function(x, y, color) {
        this.light[x][y] = color;
    }.bind(this));
};

Game.prototype.render = function() {
    'use strict';
    if(this.state.render === true) {
        this.canvas.clearRect(0, 0, 960, 576);

        if(this.pulseDir === true) {
            this.pulse += 0.3;
        } else {
            this.pulse -= 0.3;
        }

        if(this.pulse >= 20 || this.pulse <= 0) {
            this.pulseDir = !this.pulseDir;
        }

        var x, y, tile, color;
        for(x = 0; x < this.dungeon.width; x += 1) {
            for(y = 0; y < this.dungeon.height; y += 1) {
                var tile;
                if(x === this.player.x && y === this.player.y) {
                    tile = { x: 0, y: 2, color: undefined };
                } else {
                    tile = this.dungeon.at(x, y, this.level);
                }
                                     // DEBUGGING
                if(tile !== null && (this.debug === true || this.dungeon.levels[this.level].explored[x][y] === true)) {
                    if(this.fov[x][y] === undefined) {
                        // This is a seen cell, but it's not in the fov
                        this.canvas.globalAlpha = 0.3;
                    } else {
                        // The cell is in the fov
                        this.canvas.globalAlpha = this.fov[x][y];
                    }

                    // THIS IS ONLY FOR DEBUGGING
                    if(this.debug === true) {
                        this.canvas.globalAlpha = 1;
                    }

                    this.canvas.drawImage(this.tileset, tile.x * 16, tile.y * 16, 16, 16, x * 16, y * 16, 16, 16);
                    this.canvas.globalAlpha = 1;

                    if(tile.color !== undefined) {
                        this.canvas.globalCompositeOperation = 'source-atop';

                        if(this.dungeon.levels[this.level].cells[x][y].reflects === true && this.light[x][y] !== undefined && this.fov[x][y] > 0.1) {
                            var light = ROT.Color.add(this.light[x][y], [Math.round(this.pulse), Math.round(this.pulse), Math.round(this.pulse)]);
                            var finalLight = ROT.Color.add(ROT.Color.fromString(tile.color), light);

                            this.canvas.fillStyle = ROT.Color.toRGB(finalLight);
                        } else {
                            this.canvas.fillStyle = tile.color;
                        }

                        this.canvas.fillRect(x * 16, y * 16, 16, 16);
                        this.canvas.globalCompositeOperation = 'source-over';
                    }
                }
            }
        }

        if(this.state.id === State.EXAMINE.id) {
            this.canvas.strokeStyle = 'rgb(0, 255, 0)';
            this.canvas.lineWidth = 1;
            this.canvas.strokeRect(this.cursor.x * 16 + 0.5, this.cursor.y * 16 + 0.5, 16 - 1, 16 - 1); // .5 to create a 1px line instead of blurry 2px
        }
    }

    window.requestAnimationFrame(this.render.bind(this));
};

/*
 * Goes to the next turn
 */
Game.prototype.next = function() {
    this.turn += 1;
    //this.dungeon.generateFOV(this.player.x, this.player.y);
    this.computeFOV(this.player.x, this.player.y);
    this.computeLighting();
};

Game.prototype.updateInterface = function() {
    'use strict';

    if(this.state.id !== State.WELCOME.id) {
        $('.dungeon-level').text(this.level);

        // DEBUG
        $('.dungeon-turn').text(this.turn);

        var look = '', position;
        if(this.state.id === State.PLAYER.id) {
            position = { x: this.player.x, y: this.player.y };
        } else if(this.state.id === State.EXAMINE.id) {
            position = { x: this.cursor.x, y: this.cursor.y };
        }

        if(this.dungeon.levels[this.level].explored[position.x][position.y] === true) {
            if(this.dungeon.levels[this.level].cells[position.x][position.y].look !== undefined) {
                look += this.dungeon.levels[this.level].cells[position.x][position.y].look + '<br>';
            }
        } else {
            look = 'You can\'t see that far';
        }

        if(this.fov[position.x][position.y] > 0) {
            $('.character-sight-header').text('You see:');
        } else {
            $('.character-sight-header').text('You remember seeing:');
        }

        $('.character-sight').html(look === '' ? 'Nothing' : look);
    }
};

// Take input from keydown and keypress and forward it to the state
// We can also hijack keys to process keys globally
Game.prototype.input = function(key) {
    'use strict';
    switch(key) {
        case 'ctrl+d':
            this.debug = !this.debug;
            $('.character-position').toggle();
            break;
        default:
            this.state.input(key, this);
            break;
    }

    this.updateInterface();
};

Game.prototype.initializeGamepad = function() {
    this.gamepad = new Gamepad();

    this.gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
        $('span.gamepad').html('Gamepad connected, press <span class="cyan">' + (device.type === 'playstation' ? 'SELECT' : 'BACK') + '</span> to switch controller scheme.');
        $('span.back').text(device.type === 'playstation' ? 'SELECT' : 'BACK');
    });

    this.gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
        $('span.gamepad').html('Gamepad disconnected.');
    });

    this.gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
        switch(e.control) {
            case 'X':
                this.input('x');
                break;
            case 'Y':
                this.input('numpad5');
                break;
            case 'BACK':
                if($('.window.welcome:visible').length > 0) {
                    if(this.controlScheme === 'gamepad') {
                        this.controlScheme = 'keyboard';
                        $('.enter').text('ENTER');
                        $('pre.gamepad').hide();
                        $('pre.keyboard').show();
                    } else {
                        this.controlScheme = 'gamepad';
                        $('.enter').text('START');
                        $('pre.keyboard').hide();
                        $('pre.gamepad').show();
                    }
                }
                break;
            case 'START':
                // This button serves as a multi-purpose key;
                // while any windows are visible, it serves as
                // the enter key otherwise as the escape key
                if($('.window:visible').length > 0) {
                    this.input('enter');
                } else {
                    this.input('escape');
                }
                break;
        }
    }.bind(this));

    this.gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
        var now = new Date();

        if(now - this.gamepadTimer >= 100) {
            this.gamepadTimer = new Date();

            if(gamepads[0].axes[0] >= 0.5 && gamepads[0].axes[1] <= -0.5) {
                this.input('numpad9');
            } else if(gamepads[0].axes[0] >= 0.5 && gamepads[0].axes[1] >= 0.5) {
                this.input('numpad3');
            } else if(gamepads[0].axes[0] <= -0.5 && gamepads[0].axes[1] >= 0.5) {
                this.input('numpad1');
            } else if(gamepads[0].axes[0] <= -0.5 && gamepads[0].axes[1] <= -0.5) {
                this.input('numpad7');
            } else if(gamepads[0].axes[1] <= -0.7 || gamepads[0].buttons[12] === 1) {
                this.input('numpad8');
            } else if(gamepads[0].axes[0] >= 0.7 || gamepads[0].buttons[15] === 1) {
                this.input('numpad6');
            } else if(gamepads[0].axes[1] >= 0.7 || gamepads[0].buttons[13] === 1) {
                this.input('numpad2');
            } else if(gamepads[0].axes[0] <= -0.7 || gamepads[0].buttons[14] === 1) {
                this.input('numpad4');
            }
        }
    }.bind(this));

    this.gamepad.init();
};
