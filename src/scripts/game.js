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

    // Bind to the mousemove event
    $('#canvas').on('mousemove', function(e) {
        this.input('mousemove', e);
    }.bind(this)).on('click', function(e) {
        this.input('mouseclick', e);
    }.bind(this)).on('mouseleave', function(e) {
        this.input('mouseleave', e);
    }.bind(this));

    // Get the canvas context from the DOM
    this.canvas = document.getElementById('canvas').getContext('2d');

    // The game state
    this.state = State.WELCOME;
    // The game turn
    this.turn = 0;
    // The dungeon level we're currently at
    this.level = 1;

    // Shadowcaster for field of view
    this.shadowcasting = new ROT.FOV.PreciseShadowcasting(function(x, y) {
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
    this.cursor = { x: undefined, y: undefined };

    /*** TEMPORARY fov AND light 2d-arrays ***/ // Why / how are they temporary? What was the thought behind this?
    this.fov = [];
    this.light = [];
    for(var i = 0; i < this.dungeon.width; i++) {
        this.fov.push([]);
        this.light.push([]);
    }

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

Game.prototype.calculatePath = function(sx, sy, dx, dy) {
    var path = [];
    
    var astar = new ROT.Path.AStar(dx, dy, function(x, y) {
        /** This piece of code can defenitly be cleaned up **/
        if(x > 0 && y > 0 && x < this.dungeon.width && y < this.dungeon.height) {
            var a = this.dungeon.levels[this.level].cells[x][y].autopilotPasses;
            var p = this.dungeon.levels[this.level].cells[x][y].entityPasses;
            
            if(a === true) {
                return true;
            }
            return p === undefined ? false : p;
        }

        return false;
    }.bind(this));
    astar.compute(sx, sy, function(x, y) {
        path.push(x.toString() + ',' + y.toString());
    }.bind(this));
    
    return path;
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
        this.canvas.clearRect(0, 0, 800, 576);

        if(this.pulseDir === true) {
            this.pulse += 0.3;
        } else {
            this.pulse -= 0.3;
        }

        if(this.pulse >= 20 || this.pulse <= 0) {
            this.pulseDir = !this.pulseDir;
        }

        var x, y, tile;
        for(x = 0; x < this.dungeon.width; x += 1) {
            for(y = 0; y < this.dungeon.height; y += 1) {
                if(x === this.player.x && y === this.player.y) {
                    tile = { x: 0, y: 2, color: undefined };
                } else {
                    tile = this.dungeon.at(x, y, this.level);
                }
                                     // DEBUGGING                                                  END DEBUGGING //
                if(tile !== null && (this.debug === true || this.dungeon.levels[this.level].explored[x][y] === true)) {
                    if(this.debug === true) {
                        // If we're in debug mode, we draw all tiles
                        this.canvas.globalAlpha = 1;
                    } else if(this.fov[x][y] === undefined) {
                        // This is a seen cell, but it's not in the fov
                        this.canvas.globalAlpha = 0.3;
                    } else {
                        // The cell is in the fov
                        this.canvas.globalAlpha = this.fov[x][y];
                    }

                    this.canvas.drawImage(this.tileset, tile.x * 16, tile.y * 16, 16, 16, x * 16, y * 16, 16, 16);
                    this.canvas.globalAlpha = 1;

                    if(tile.color !== undefined) {
                        this.canvas.globalCompositeOperation = 'source-atop';

                        // Draw the tile with yellow if it's in the current path
                        if(this.player.path.indexOf(x.toString() + ',' + y.toString()) !== -1) {
                            this.canvas.fillStyle = '#ff0';
                        } else if(this.dungeon.levels[this.level].cells[x][y].reflects === true && this.light[x][y] !== undefined && this.fov[x][y] > 0.1) {
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

        if(this.state.id === State.CURSOR.id) {
            this.canvas.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.canvas.fillRect(this.cursor.x * 16, this.cursor.y * 16, 16, 16);
        }
    }

    window.requestAnimationFrame(this.render.bind(this));
};

Game.prototype.next = function() {
    this.turn += 1;
    this.computeFOV(this.player.x, this.player.y);
    this.computeLighting();
    this.updateInterface();
};

Game.prototype.updateInterface = function() {
    'use strict';

    if(this.state.id !== State.WELCOME.id) {
        $('.dungeon-level').text(this.level);
        $('.dungeon-turn').text(this.turn);

        var look = '', position;
        if(this.state.id === State.PLAYER.id) {
            // If we recently moved the mouse, show what's there instead of below the player
            if(this.cursor.x !== undefined && this.cursor.y !== undefined) {
                position = this.cursor;
            } else {
                position = { x: this.player.x, y: this.player.y };
            }
        } else if(this.state.id === State.AUTOPILOT.id) {
            position = { x: this.player.x, y: this.player.y };
        } else if(this.state.id === State.CURSOR.id) {
            position = { x: this.cursor.x, y: this.cursor.y };
        }

        if(this.dungeon.levels[this.level].explored[position.x][position.y] === true) {
            if(this.dungeon.levels[this.level].cells[position.x][position.y].look !== undefined) {
                look += this.dungeon.levels[this.level].cells[position.x][position.y].look + '<br>';
            }

            if(this.fov[position.x][position.y] > 0) {
                $('.character-sight-header').text('You see:');
            } else {
                $('.character-sight-header').text('You remember seeing:');
            }

            $('.character-sight').html(look === '' ? 'Nothing' : look);
        } else {
            $('.character-sight-header').text('You can\'t see that far');
            $('.character-sight').html('');
        }
        
        /** This code should really not be here... **/
        if(this.state.id === State.CURSOR.id) {
            this.player.path = [];

            // Only calculate a path if we've seen this cell
            if(this.dungeon.levels[this.level].explored[this.cursor.x][this.cursor.y]) {
                this.player.path = this.calculatePath(this.player.x, this.player.y, this.cursor.x, this.cursor.y);
                // Remove the top position since this is the players current position
                this.player.path.shift();
            }
        }
    }
};

// Take input from keydown and keypress and forward it to the state
// We can also hijack keys to process keys globally
Game.prototype.input = function(key, e) {
    'use strict';
    switch(key) {
        case 'ctrl+d':
            this.debug = !this.debug;
            $('.character-position').toggle();
            break;
        default:
            this.state.input(key, e, this);
            break;
    }

    this.updateInterface();
};
