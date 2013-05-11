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
            this.keydown(key, Keys[key]); // Should be input
            return false;
        }
    }.bind(this)).on('keypress', function(e) {
        if(Keys.hasOwnProperty(e.which + 200)) {
            this.keydown(e.which + 200, Keys[e.which + 200]); // Should be input
            return false;
        }
    }.bind(this));
    
    // Get the canvas context from the DOM
    this.canvas = document.getElementById('canvas').getContext('2d');
    
    // welcome - showing welcome screen
    // running - running / gameplay
    this.state = 'welcome';
    
    // 
    this.turnCounter = 0;
    
    // Create the dungeon instance and generate a dungeon
    this.dungeon = new Dungeon();
    
    // Create the player instance and position him in the center of the dungenon
    this.player = new Player(this.dungeon.startPosition.x, this.dungeon.startPosition.y);
    this.cursor = new Cursor();
    
    // The different modes the player can be in
    this.modes = {
        MOVEMENT: 0,    // Player movement
        LOOK: 1         // Look (move the cursor)
    };
    // Set the current mode to player movement
    this.mode = this.modes.MOVEMENT;
    
    
    // ???
    this.updateInterface();
    
    // ???
    this.dungeon.generateFOV(this.player.x, this.player.y);
    
    // The images used as tilesets
    this.tileset = new Image();
    
    this.tileset.onload = function() {
        this.render();
    }.bind(this);
    

    // Set the paths for the tilesets
    this.tileset.src = 'images/tileset.png';
    
    this.debug = true;
    
    if(this.debug === true) {
        $('.window').hide();
        this.state = 'running';
    }
    
    this.pulseDir = true; // true = addition, false = subtraction
    this.pulse = 0;
};

Game.prototype.render = function() {
    'use strict';
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
                    
                    if(this.dungeon.light[x][y] !== undefined && this.dungeon.fov[x][y] > 0.1) {
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
    
    if(this.mode === this.modes.LOOK) {
        this.canvas.strokeStyle = '#0f0';
        this.canvas.lineWidth = 1;
        this.canvas.strokeRect(this.cursor.x * 16 + 0.5, this.cursor.y * 16 + 0.5, 16 - 1, 16 - 1); // .5 to create a 1px line instead of blurry 2px
    }
    
    window.requestAnimationFrame(this.render.bind(this));
};

/*
 * Goes to the next turn
 */
Game.prototype.turn = function() {
    this.turnCounter += 1;
};

Game.prototype.updateInterface = function() {
    'use strict';

    $('.dungeon-level').text(this.dungeon.level);
    
    // DEBUG
    $('.dungeon-turn').text(this.turnCounter);
    
    var look = '',
        position = {
            x: (this.mode === this.modes.MOVEMENT) ? this.player.x : this.cursor.x,
            y: (this.mode === this.modes.MOVEMENT) ? this.player.y : this.cursor.y
        };
    
    if(this.dungeon.fov[position.x][position.y] > 0) {
        if(this.dungeon.cells[position.x][position.y] !== null && this.dungeon.cells[position.x][position.y].look !== undefined) {
            look += this.dungeon.cells[position.x][position.y].look + '<br>';
        }
    } else {
        look = 'You can\'t see that far';
    }
    
    $('.character-sight').html(look === '' ? 'Nothing' : look);
};

Game.prototype.keydown = function(code, key) {
    'use strict';
    
    if(key === 'enter') {
        switch(this.state) {
            case 'welcome':
                $('.window').fadeOut();
                this.state = 'running';
                break;
        }
    }
    
    if(this.state === 'running') {
    
        // Used for movement
        var newPosition = {
            x: (this.mode === this.modes.MOVEMENT) ? this.player.x : this.cursor.x,
            y: (this.mode === this.modes.MOVEMENT) ? this.player.y : this.cursor.y
        };
        
        // Movement north
        if(key === 'numpad8' || key === 'k') {
            newPosition.y -= 1;
        // Movement north east
        } else if(key === 'numpad9' || key === 'u') {
            newPosition.x += 1;
            newPosition.y -= 1;
        // Movement east
        } else if(key === 'numpad6' || key === 'l') {
            newPosition.x += 1;
        // Movement south east
        } else if(key === 'numpad3' || key === 'n') {
            newPosition.x += 1;
            newPosition.y += 1;
        // Movement south
        } else if(key === 'numpad2' || key === 'j') {
            newPosition.y += 1;
        // Movement south west
        } else if(key === 'numpad1' || key === 'b') {
            newPosition.x -= 1;
            newPosition.y += 1;
        // Movement west
        } else if(key === 'numpad4' || key === 'h') {
            newPosition.x -= 1;
        // Movement north west
        } else if(key === 'numpad7' || key === 'y') {
            newPosition.x -= 1;
            newPosition.y -= 1;
        // Wait
        } else if(key === 'numpad5' || key === '.') {
            this.turn();
        } else if(key === '>') {
            if(this.dungeon.cells[this.player.x][this.player.y].id === Tile.STAIRS.id) {
                // Generate a new level
                this.dungeon.level += 1;
                this.dungeon.generate();
                
                // Move the player to the center
                newPosition.x = Math.floor(this.dungeon.width / 2);
                newPosition.y = Math.floor(this.dungeon.height / 2);
                
                // UPDATE THE TURN COUNTER
                this.turn();
            }
        // Switch for other keys
        } else {
            switch(key) {
                // Toggle the debug mode
                case 'd':
                    this.debug = !this.debug;
                    break;
                // Examine / Look
                //case Keys.VK_X:
                case 'x':
                    if(this.mode === this.modes.LOOK) {
                        // Go back to movement mode and reset the newPosition
                        this.mode = this.modes.MOVEMENT;
                        newPosition = {
                            x: this.player.x,
                            y: this.player.y
                        };
                    } else {
                        this.mode = this.modes.LOOK;
                        this.cursor = {
                            x: this.player.x,
                            y: this.player.y
                        };
                    }
                    break;
                // Pray
                //case Keys.VK_Q:
                case 'q':
                    if(this.dungeon.cells[this.player.x][this.player.y - 1].id === Tile.SHRINE.id) {
                        this.dungeon.cells[this.player.x][this.player.y - 1] = Tile.SHRINE_USED;
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x + 1][this.player.y].id === Tile.SHRINE.id) {
                        this.dungeon.cells[this.player.x + 1][this.player.y] = Tile.SHRINE_USED;
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x][this.player.y + 1].id === Tile.SHRINE.id) {
                        this.dungeon.cells[this.player.x][this.player.y + 1] = Tile.SHRINE_USED;
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x - 1][this.player.y].id === Tile.SHRINE.id) {
                        this.dungeon.cells[this.player.x - 1][this.player.y] = Tile.SHRINE_USED;
                        this.turn();
                    }
                    break;
                // Escape - Show information
                //case Keys.VK_ESC:
                case 'escape':
                    this.state = 'welcome';
                    $('.welcome').fadeIn();
                    break;
            }
        }
        
        if(this.mode === this.modes.LOOK) {
            this.cursor.x = newPosition.x;
            this.cursor.y = newPosition.y;
        // If there has been a change to the newPosition
        } else if(this.player.x !== newPosition.x || this.player.y !== newPosition.y) {
            if(this.dungeon.cells[newPosition.x][newPosition.y].entityPasses === true) {
                this.player.x = newPosition.x;
                this.player.y = newPosition.y;
                    
                this.dungeon.generateFOV(this.player.x, this.player.y);
                    
                this.turn();
            }
            
            // Check for special behaviour on tiles
            switch(this.dungeon.cells[this.player.x][this.player.y].id) {
                case Tile.DOOR.id:
                    this.dungeon.cells[this.player.x][this.player.y] = Tile.DOOR_OPEN;
                    break;
            }
        }
        
        // Update the interface
        this.updateInterface();
    
    }
};
