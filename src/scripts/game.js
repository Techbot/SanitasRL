/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
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
    // death - showing death screen
    // score - showing score screen
    // running - running / gameplay
    this.state = 'welcome';
    
    // 
    this.turnCounter = 0;
    
    // Create the dungeon instance and generate a dungeon
    this.dungeon = new Dungeon();
    
    // Create the player instance and position him in the center of the dungenon
    this.player = new Player(Math.floor(this.dungeon.width / 2), Math.floor(this.dungeon.height / 2));

    // The position of the cursor
    this.cursor = {
        x: undefined,
        y: undefined
    };
    
    // The different modes the player can be in
    this.modes = {
        MOVEMENT: 0,    // Player movement
        LOOK: 1,        // Look (move the cursor)
        TELEKINESIS: 2  // Telekinesis (move the cursor, use telekinesis on the targeted object)
    };
    // Set the current mode to player movement
    this.mode = this.modes.MOVEMENT;
    
    // If you have the Amulet of Detection this variable will help controlling if the amulet is currently glowing
    this.amulet_glowing = false;
    
    
    // ???
    this.updateInterface();
    
    // ???
    this.dungeon.generateFOV(this.player.x, this.player.y);
    //this.dungeon.updateVisitedCells(this.fov);
    
    // The images used as tilesets
    this.tileset = new Image();
    
    this.tileset.onload = function() {
        this.render();
    }.bind(this);
    

    // Set the paths for the tilesets
    this.tileset.src = 'images/tileset.png';
    
    this.debug = false;
};

Game.prototype.render = function() {
    'use strict';
    this.canvas.clearRect(0, 0, 960, 576);

    var x, y, tile, color;
    for(x = 0; x < this.dungeon.width; x += 1) {
        for(y = 0; y < this.dungeon.height; y += 1) {
            var tile;
            if(x === this.player.x && y === this.player.y) {
                tile = { x: 3, y: 2, color: undefined };
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
                    this.canvas.fillStyle = tile.color;
                    this.canvas.fillRect(x * 16, y * 16, 16, 16);
                    this.canvas.globalCompositeOperation = 'source-over';
                }
            }
        }
    }
    
    if(this.mode === this.modes.LOOK || this.mode === this.modes.TELEKINESIS) {
        this.canvas.strokeStyle = '#0f0';
        this.canvas.lineWidth = 1;
        this.canvas.strokeRect(this.cursor.x * 16 + 0.5, this.cursor.y * 16 + 0.5, 16 - 1, 16 - 1); // .5 to create a 1px line instead of blurry 2px
    }
    
    window.requestAnimationFrame(this.render.bind(this));
};

/*
 * Goes to the next turn, also updates all monsters
 */
Game.prototype.turn = function() {
    var i;

    // Death
    if(this.player.health <= 0) {
        // Set HP to 0 if it's less than 0
        this.player.health = 0;
        this.player.updateInterface();
        
        // Show the death message
        this.state = 'death';
        $('.death span.turns').text(this.turnCounter);
        $('.death span.lastHit').text(this.player.lastHitPro);
        $('.death span.enemy').text(this.player.lastHit);
        $('.death span.level').text(this.dungeon.level);
        $('.death span.weapon').text(this.player.weapon.displayName());
        $('.death span.armour').text(this.player.armour.displayName());
        $('.death span.jewelry').text(this.player.jewelry.displayName());
        $('.background').fadeIn(1500);
        $('.death').fadeIn(1500);
    }
    
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
        if(this.dungeon.cells[position.x][position.y] !== null && Tile[this.dungeon.cells[position.x][position.y]].look !== undefined) {
            look += Tile[this.dungeon.cells[position.x][position.y]].look + '<br>';
        }
        if(this.dungeon.itemAt(position.x, position.y) !== undefined) {
            look += this.dungeon.itemAt(position.x, position.y).displayName() + '<br>';
        }
    } else {
        look = 'You can\'t see that far';
    }
    
    $('.character-sight').html(look === '' ? 'Nothing' : look);
};

Game.prototype.updateAmulet = function() {
    if(this.player.jewelry.id === 'amulet_of_detection') {
        // check if there's enemies within a radius of 7 from you
        var x, y, enemies = false;
        for(x = this.player.x - 7; x <= this.player.x + 7; x += 1) {
            for(y = this.player.y - 7; y <= this.player.y + 7; y += 1) {

            }
        }

        if(enemies === false && this.amulet_glowing === true) {
            this.amulet_glowing = false;
            // TODO: Notify user about amulet not glowing
        }
    }
};

Game.prototype.keydown = function(code, key) {
    'use strict';
    
    if(key === 'enter') {
        switch(this.state) {
            case 'welcome':
                $('.window').fadeOut();
                this.state = 'running';
                break;
            case 'death':
                $('.window').fadeOut();
                this.initialize();
                this.state = 'running';
                break;
            case 'score':
                $('.window').fadeOut();
                this.initialize();
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
        //if(Keys.VK_MOVEMENT_NORTH.indexOf(e.which) !== -1) {
        if(key === 'numpad8' || key === 'k') {
            newPosition.y -= 1;
        // Movement north east
        //} else if(Keys.VK_MOVEMENT_NORTH_EAST.indexOf(e.which) !== -1) {
        } else if(key === 'numpad9' || key === 'u') {
            newPosition.x += 1;
            newPosition.y -= 1;
        // Movement east
        //} else if(Keys.VK_MOVEMENT_EAST.indexOf(e.which) !== -1) {
        } else if(key === 'numpad6' || key === 'l') {
            newPosition.x += 1;
        // Movement south east
        //} else if(Keys.VK_MOVEMENT_SOUTH_EAST.indexOf(e.which) !== -1) {
        } else if(key === 'numpad3' || key === 'n') {
            newPosition.x += 1;
            newPosition.y += 1;
        // Movement south
        //} else if(Keys.VK_MOVEMENT_SOUTH.indexOf(e.which) !== -1) {
        } else if(key === 'numpad2' || key === 'j') {
            newPosition.y += 1;
        // Movement south west
        //} else if(Keys.VK_MOVEMENT_SOUTH_WEST.indexOf(e.which) !== -1) {
        } else if(key === 'numpad1' || key === 'b') {
            newPosition.x -= 1;
            newPosition.y += 1;
        // Movement west
        //} else if(Keys.VK_MOVEMENT_WEST.indexOf(e.which) !== -1) {
        } else if(key === 'numpad4' || key === 'h') {
            newPosition.x -= 1;
        // Movement north west
        //} else if(Keys.VK_MOVEMENT_NORTH_WEST.indexOf(e.which) !== -1) {
        } else if(key === 'numpad7' || key === 'y') {
            newPosition.x -= 1;
            newPosition.y -= 1;
        // Wait
        //} else if(Keys.VK_WAIT.indexOf(e.which) !== -1) {
        } else if(key === 'numpad5' || key === '.') {
            // UPDATE THE TURN COUNTER
            this.turn();
        // Stairs (THE SWEDISH <> KEY OR ENTER)
        //} else if(Keys.VK_STAIRS.indexOf(e.which) !== -1) {
        } else if(key === '>') {
            if(this.dungeon.cells[this.player.x][this.player.y] === Tile.STAIRS) {
                // Generate a new level
                this.dungeon.level += 1;
                this.dungeon.generate();
                
                // Move the player to  the center
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
                // Get / Grab / Pick up
                //case Keys.VK_G:
                case 'g':
                    if(this.dungeon.itemAt(this.player.x, this.player.y) !== undefined) {
                        var olditem;
                        
                        // equip the new item
                        if(this.dungeon.itemAt(this.player.x, this.player.y).type === Item.type.weapon) {
                            olditem = this.player.weapon;
                            this.player.weapon = this.dungeon.itemAt(this.player.x, this.player.y);
                        } else if(this.dungeon.itemAt(this.player.x, this.player.y).type === Item.type.jewelry) {
                            olditem = this.player.jewelry;
                            this.player.jewelry = this.dungeon.itemAt(this.player.x, this.player.y);
                        } else {
                            olditem = this.player.armour;
                            this.player.armour = this.dungeon.itemAt(this.player.x, this.player.y);
                        }
                        
                        // replace the old item on the ground
                        olditem.x = this.player.x;
                        olditem.y = this.player.y;
                        this.dungeon.replaceItemAt(this.player.x, this.player.y, olditem);

                        
                        // FARGOTH'S RING EQUIP
                        if(olditem.type === Item.type.jewelry && this.player.jewelry.id === 'fargoths_ring') {
                            this.player.health += 2;
                        // UNEQUIP
                        } else if(olditem.id === 'fargoths_ring') {
                            this.player.health -= 2;
                            this.player.lastHitPro = 'by removing';
                            this.player.lastHit = 'Fargoth\'s Ring';
                        }
                        
                        this.player.updateInterface();
                        
                        // UPDATE THE TURN COUNTER
                        this.turn();
                    }
                    break;
                // Telekinesis
                //case Keys.VK_T:
                case 't':
                    // cloudcleaver is the only item with telekinesis
                    if(this.player.weapon.id === 'cloudcleaver') {
                        if(this.mode === this.modes.TELEKINESIS) {
                        
                            if(this.dungeon.itemAt(this.cursor.x, this.cursor.y) !== undefined) {
                                var olditem;
                                
                                // equip the new item
                                if(this.dungeon.itemAt(this.cursor.x, this.cursor.y).type === Item.type.weapon) {
                                    olditem = this.player.weapon;
                                    this.player.weapon = this.dungeon.itemAt(this.cursor.x, this.cursor.y);
                                } else if(this.dungeon.itemAt(this.player.x, this.player.y).type === Item.type.jewelry) {
                                    olditem = this.player.jewelry;
                                    this.player.jewelry = this.dungeon.itemAt(this.player.x, this.player.y);
                                } else {
                                    olditem = this.player.armour;
                                    this.player.armour = this.dungeon.itemAt(this.cursor.x, this.cursor.y);
                                }
                                
                                // replace the old item on the ground
                                olditem.x = this.player.x;
                                olditem.y = this.player.y;
                                this.dungeon.replaceItemAt(this.cursor.x, this.cursor.y, olditem);

                                // FARGOTH'S RING EQUIP
                                if(olditem.type === Item.type.jewelry && this.player.jewelry.id === 'fargoths_ring') {
                                    this.player.health += 2;
                                // UNEQUIP
                                } else if(olditem.id === 'fargoths_ring') {
                                    this.player.health -= 2;
                                    this.player.lastHitPro = 'by removing';
                                    this.player.lastHit = 'Fargoth\'s Ring';
                                }
                                
                                this.player.updateInterface();
                                
                                // UPDATE THE TURN COUNTER
                                this.turn();
                            }
                            
                            if(this.dungeon.cells[this.cursor.x][this.cursor.y] === Tile.DOOR) {
                                this.dungeon.cells[this.cursor.x][this.cursor.y] = Tile.DOOR_OPEN;
                            }
                            
                            // Go back to movement mode and reset the newPosition
                            this.mode = this.modes.MOVEMENT;
                            newPosition = {
                                x: this.player.x,
                                y: this.player.y
                            };
                        } else {
                            this.mode = this.modes.TELEKINESIS;
                            this.cursor = {
                                x: this.player.x,
                                y: this.player.y
                            };
                        }
                    }
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
                    if(this.dungeon.cells[this.player.x][this.player.y - 1] === Tile.SHRINE) {
                        this.player.health += 1 + (this.dungeon.level / 2);
                        this.player.updateInterface();
                        this.dungeon.cells[this.player.x][this.player.y - 1] = Tile.SHRINE_USED;
                        
                        // TODO: Notify user about gaining health from drinking and the well being exhausted
                        
                        // UPDATE THE TURN COUNTER
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x + 1][this.player.y] === Tile.SHRINE) {
                        this.player.health += 1 + (this.dungeon.level / 2);
                        this.player.updateInterface();
                        this.dungeon.cells[this.player.x + 1][this.player.y] = Tile.SHRINE_USED;
                        
                        // TODO: Notify user about gaining health from drinking and the well being exhausted
                        
                        // UPDATE THE TURN COUNTER
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x][this.player.y + 1] === Tile.SHRINE) {
                        this.player.health += 1 + (this.dungeon.level / 2);
                        this.player.updateInterface();
                        this.dungeon.cells[this.player.x][this.player.y + 1] = Tile.SHRINE_USED;
                        
                        // TODO: Notify user about gaining health from drinking and the well being exhausted
                        
                        // UPDATE THE TURN COUNTER
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x - 1][this.player.y] === Tile.SHRINE) {
                        this.player.health += 1 + (this.dungeon.level / 2);
                        this.player.updateInterface();
                        this.dungeon.cells[this.player.x - 1][this.player.y] = Tile.SHRINE_USED;
                        
                        // TODO: Notify user about gaining health from drinking and the well being exhausted
                        
                        // UPDATE THE TURN COUNTER
                        this.turn();
                    }
                    break;
                // Escape - Show information
                //case Keys.VK_ESC:
                case 'escape':
                    this.state = 'welcome';
                    $('.background').fadeIn();
                    $('.welcome .bottom').html('Press <span>ENTER</span> to return');
                    $('.welcome').fadeIn();
                    break;
            }
        }
        
        if(this.mode === this.modes.LOOK || this.mode === this.modes.TELEKINESIS) {
            this.cursor.x = newPosition.x;
            this.cursor.y = newPosition.y;
        // If there has been a change to the newPosition
        } else if(this.player.x !== newPosition.x || this.player.y !== newPosition.y) {
            if(Tile[this.dungeon.cells[newPosition.x][newPosition.y]].entityPasses === true) {
                this.player.x = newPosition.x;
                this.player.y = newPosition.y;
                    
                this.dungeon.generateFOV(this.player.x, this.player.y);
                    
                //this.fov = this.calculateFOV();
                
                // update all other entities
                // they should attack here?
                this.turn();
            }
            //this.dungeon.updateVisitedCells(this.fov);
            
            // Check for special behaviour on tiles
            switch(this.dungeon.cells[this.player.x][this.player.y]) {
                case Tile.BARS_DOOR:
                    this.dungeon.cells[this.player.x][this.player.y] = Tile.BARS_DOOR_OPEN;
                    break;
                case Tile.DOOR:
                    this.dungeon.cells[this.player.x][this.player.y] = Tile.DOOR_OPEN;
                    break;
                case Tile.MONSTER_SPAWNER:
                    if(this.player.armour.id !== 'icyveins') {
                        // spawn monsters

                        // TODO: Notify user about you triggering the monster trap
                    } else {
                        // TODO: Notify user about you noticing the monster trap
                    }
                    this.dungeon.cells[this.player.x][this.player.y] = Tile.FLOOR;
                    break;
                case Tile.FIREBALL:
                    this.player.health -= 2;
                    this.player.lastHitPro = 'by stepping into';
                    this.player.lastHit = 'a fire';
                    // TODO: Notify user about taking 2 damage from the fire
                    break;
            }
        }
        
        this.updateAmulet();
        
        // Update the interface
        this.updateInterface();
    
    }
};