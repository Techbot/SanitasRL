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

    this.state = State.WELCOME;

    //
    this.turnCounter = 0;

    // Create the dungeon instance and generate a dungeon
    this.dungeon = new Dungeon();

    // Create the player instance and position him in the center of the dungenon
    this.player = new Player(this.dungeon.startPosition.x, this.dungeon.startPosition.y);
    this.cursor = undefined;

    // ???
    //this.updateInterface();

    // ???
    this.dungeon.generateFOV(this.player.x, this.player.y);

    // The images used as tilesets
    this.tileset = new Image();

    this.tileset.onload = function() {
        this.render();
    }.bind(this);


    // Set the paths for the tilesets
    this.tileset.src = 'images/tileset.png';

    this.debug = false;

    if(this.debug === true) {
        $('.window').hide();
        //this.state = 'running';
        this.state = State.PLAYER;
    }

    this.pulseDir = true; // true = addition, false = subtraction
    this.pulse = 0;
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
                    tile = this.dungeon.at(x, y);
                }
                                     // DEBUGGING
                if(tile !== null && (this.debug === true || this.dungeon.seenCells[x][y] === true)) {
                    if(this.dungeon.fov[x][y] < 0.1) {
                        // This is a seen cell, but it's not in the fov
                        this.canvas.globalAlpha = 0.3;
                    } else {
                        // The cell is in the fov
                        this.canvas.globalAlpha = this.dungeon.fov[x][y];
                    }

                    // THIS IS ONLY FOR DEBUGGING
                    if(this.debug === true) {
                        this.canvas.globalAlpha = 1;
                    }

                    this.canvas.drawImage(this.tileset, tile.x * 16, tile.y * 16, 16, 16, x * 16, y * 16, 16, 16);
                    this.canvas.globalAlpha = 1;

                    if(tile.color !== undefined) {
                        this.canvas.globalCompositeOperation = 'source-atop';

                        if(this.dungeon.cells[x][y].reflects === true && this.dungeon.light[x][y] !== undefined && this.dungeon.fov[x][y] > 0.1) {
                            var light = ROT.Color.add(this.dungeon.light[x][y], [Math.round(this.pulse), Math.round(this.pulse), Math.round(this.pulse)]);
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
Game.prototype.turn = function() {
    this.turnCounter += 1;
    this.dungeon.generateFOV(this.player.x, this.player.y);
};

Game.prototype.updateInterface = function() {
    'use strict';

    if(this.state.id !== State.WELCOME.id) {
        $('.dungeon-level').text(this.dungeon.level);

        // DEBUG
        $('.dungeon-turn').text(this.turnCounter);

        var look = '', position;
        if(this.state.id === State.PLAYER.id) {
            position = { x: this.player.x, y: this.player.y };
        } else if(this.state.id === State.EXAMINE.id) {
            position = { x: this.cursor.x, y: this.cursor.y };
        }

        if(this.dungeon.seenCells[position.x][position.y] === true) {
            if(this.dungeon.cells[position.x][position.y] !== null && this.dungeon.cells[position.x][position.y].look !== undefined) {
                look += this.dungeon.cells[position.x][position.y].look + '<br>';
            }
        } else {
            look = 'You can\'t see that far';
        }

        if(this.dungeon.fov[position.x][position.y] > 0) {
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
            break;
        default:
            this.state.input(key, this);
            break;
    }

    this.updateInterface();
};
