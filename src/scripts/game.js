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
    
    // The size of the individual tiles for the viewport
    this.tileSize = 16;
    
    // The images used as tilesets
    this.images = {
        items: new Image(),
        tileset: new Image(),
        monsters: new Image(),
        player: new Image()
    };
    
    this.shouldRender = false;
    
    // welcome - showing welcome screen
    // death - showing death screen
    // score - showing score screen
    // running - running / gameplay
    this.state = 'welcome';
};

Game.prototype.initialize = function() {
    'use strict';
   
    this.bossClosed = false;
   
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

    // The positions of the camera
    this.camera = {
        x: undefined,
        y: undefined,
        x2: undefined,
        y2: undefined
    };

    // Set the paths for the tilesets
    this.images.items.src = 'images/items.png';
    this.images.tileset.src = 'images/tileset.png';
    this.images.monsters.src = 'images/monsters.png';
    this.images.player.src = 'images/player.png';
    
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
    //this.dungeon.updateVisitedCells(this.fov);
    
    this.shouldRender = true;
    
    this.render();
};

/*
 * Positions the camera to center around a point (dx, dy)
 */
Game.prototype.updateCamera = function(dx, dy) {
    'use strict';

    this.camera = {
        //x: dx - Math.ceil(this.width.cells / 2),
        //y: dy - Math.ceil(this.height.cells / 2),
        //x2: dx + Math.ceil(this.width.cells / 2),
        //y2: dy + Math.ceil(this.height.cells / 2)
        x: dx - 30,
        y: dy - 18,
        x2: dx + 29,
        y2: dy + 17,
    };
};

Game.prototype.resize = function(e) {
    'use strict';

    // Get the width and height of the window
    var width = parseInt($(window).width(), 10),
        height = parseInt($(window).height(), 10);

    // Update the canvases with the new width and height
    $('canvas#canvas').attr({ 'width': 960, 'height': 576});
    
    // Update the camera & render if the player & camera has been defined
    if(this.player !== undefined || this.camera !== undefined) {
        this.shouldRender = true;
    }
};

Game.prototype.render = function() {
    'use strict';
 
    this.updateCamera(this.player.x, this.player.y);
    this.newRender();
    this.shouldRender = false;
    
    window.requestAnimationFrame(this.render.bind(this));
};

/*
 * Goes to the next turn, also updates all monsters
 */
Game.prototype.turn = function() {
    var i;
    for(i = 0; i < this.dungeon.monsters.length; i += 1) {
        //if(this.pointIsInsideFOV(this.dungeon.monsters[i].x, this.dungeon.monsters[i].y)) {
            this.dungeon.monsters[i].lastKnownPositionOfPlayer = {
                x: this.player.x,
                y: this.player.y
            };
        //}
        
        if(this.dungeon.monsters[i].lastKnownPositionOfPlayer !== undefined) {
            this.dungeon.monsters[i].turn(this.player, this.dungeon, this.turnCounter);
        }
    }
    
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
    
    this.shouldRender = true;
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
    
    //if(this.pointIsInsideFOV(position.x, position.y) === true) {
        if(this.dungeon.cells[position.x][position.y].look(this.player) !== undefined) {
            look += this.dungeon.cells[position.x][position.y].look(this.player) + '<br>';
        }
        if(this.dungeon.monsterAt(position.x, position.y) !== undefined) {
            look += this.dungeon.monsterAt(position.x, position.y).displayName() + '<br>';
        }
        if(this.dungeon.itemAt(position.x, position.y) !== undefined) {
            look += this.dungeon.itemAt(position.x, position.y).displayName() + '<br>';
        }
    /*} else {
        look = 'You can\'t see that far';
    }*/
    
    $('.character-sight').html(look === '' ? 'Nothing' : look);
};

Game.prototype.updateAmulet = function() {
    if(this.player.jewelry.id === 'amulet_of_detection') {
        // check if there's enemies within a radius of 7 from you
        var x, y, enemies = false;
        for(x = this.player.x - 7; x <= this.player.x + 7; x += 1) {
            for(y = this.player.y - 7; y <= this.player.y + 7; y += 1) {
                if(this.dungeon.monsterAt(x, y) !== undefined) {
                    enemies = true;
                    
                    if(this.amulet_glowing === false) {
                        this.amulet_glowing = true;
                        // TODO: Notify user about amulet glowing
                    }
                
                }
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
            if(this.dungeon.cells[this.player.x][this.player.y].id === Tile.STAIRS.id) {
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
                                if(lditem.type === Item.type.jewelry && this.player.jewelry.id === 'fargoths_ring') {
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
                            
                            switch(this.dungeon.cells[this.cursor.x][this.cursor.y].id) {
                                case Tile.DOOR.id:
                                    this.dungeon.cells[this.cursor.x][this.cursor.y] = Tile.DOOR_OPEN;
                                    break;
                            }
                            
                            // Go back to movement mode and reset the newPosition
                            this.mode = this.modes.MOVEMENT;
                            newPosition = {
                                x: this.player.x,
                                y: this.player.y
                            };
                            this.shouldRender = true;
                        } else {
                            this.mode = this.modes.TELEKINESIS;
                            this.cursor = {
                                x: this.player.x,
                                y: this.player.y
                            };
                            this.shouldRender = true;
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
                        this.shouldRender = true;
                    } else {
                        this.mode = this.modes.LOOK;
                        this.cursor = {
                            x: this.player.x,
                            y: this.player.y
                        };
                        this.shouldRender = true;
                    }
                    break;
                // Pray
                //case Keys.VK_Q:
                case 'q':
                    if(this.dungeon.cells[this.player.x][this.player.y - 1].id === Tile.SHRINE.id) {
                        this.player.health += 1 + (this.dungeon.level / 2);
                        this.player.updateInterface();
                        this.dungeon.cells[this.player.x][this.player.y - 1] = Tile.SHRINE_USED;
                        
                        // TODO: Notify user about gaining health from drinking and the well being exhausted
                        
                        // UPDATE THE TURN COUNTER
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x + 1][this.player.y].id === Tile.SHRINE.id) {
                        this.player.health += 1 + (this.dungeon.level / 2);
                        this.player.updateInterface();
                        this.dungeon.cells[this.player.x + 1][this.player.y] = Tile.SHRINE_USED;
                        
                        // TODO: Notify user about gaining health from drinking and the well being exhausted
                        
                        // UPDATE THE TURN COUNTER
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x][this.player.y + 1].id === Tile.SHRINE.id) {
                        this.player.health += 1 + (this.dungeon.level / 2);
                        this.player.updateInterface();
                        this.dungeon.cells[this.player.x][this.player.y + 1] = Tile.SHRINE_USED;
                        
                        // TODO: Notify user about gaining health from drinking and the well being exhausted
                        
                        // UPDATE THE TURN COUNTER
                        this.turn();
                    } else if(this.dungeon.cells[this.player.x - 1][this.player.y].id === Tile.SHRINE.id) {
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
            this.shouldRender = true;
        // If there has been a change to the newPosition
        } else if(this.player.x !== newPosition.x || this.player.y !== newPosition.y) {
            if(this.dungeon.cells[newPosition.x][newPosition.y].solid === false) {
                if(this.dungeon.monsterAt(newPosition.x, newPosition.y) === undefined) {
                    // Move
                    
                    /*if(this.dungeon.cells[newPosition.x][newPosition.y].id === Tile.BOSS_DOOR.id) {
                        // TODO: Notify user about entering the boss lair
                        this.dungeon.cells[newPosition.x][newPosition.y] = Tile.BOSS_SECOND_DOOR;
                    } else {*/
                        this.player.x = newPosition.x;
                        this.player.y = newPosition.y;
                            
                        //this.fov = this.calculateFOV();
                        
                        // update all other entities
                        // they should attack here?
                        this.turn();
                    //}
                } else {
                    // Fight
                    if(ROT.RNG.getRangeUniform(0, 100) <= this.player.hit() + (5 * this.dungeon.monsterAt(newPosition.x, newPosition.y).calcDefence())) {
                        if(this.player.calcDamage() - this.dungeon.monsterAt(newPosition.x, newPosition.y).calcDefence() > 0) {
                        
                            this.dungeon.monsterAt(newPosition.x, newPosition.y).health -= (this.player.calcDamage() - this.dungeon.monsterAt(newPosition.x, newPosition.y).calcDefence());
                        
                            var mess = 'You dealt ' + (this.player.calcDamage() - this.dungeon.monsterAt(newPosition.x, newPosition.y).calcDefence()) + ' damage to the ' + this.dungeon.monsterAt(newPosition.x, newPosition.y).name;
                            if(this.dungeon.monsterAt(newPosition.x, newPosition.y).health > 0) {
                                mess += ', ' + this.dungeon.monsterAt(newPosition.x, newPosition.y).health + ' health remaining.';
                            }
                        
                            // TODO: Notify user about combat (variable: mess)
                            
                            if(this.dungeon.monsterAt(newPosition.x, newPosition.y).health <= 0) {
                            
                                if(this.dungeon.monsterAt(newPosition.x, newPosition.y).name === 'Dragon') {
                                    this.state = 'score';
                                    $('.score span.weapon').text(this.player.weapon.displayName());
                                    $('.score span.armour').text(this.player.armour.displayName());
                                    $('.score span.jewelry').text(this.player.jewelry.displayName());
                                    $('.background').fadeIn(1500);
                                    $('.score').fadeIn(1500);
                                }
                                
                                // TODO: Notify user about the monster dying
                                
                                // if the monster has items, drop one of them
                                if(this.dungeon.monsterAt(newPosition.x, newPosition.y).weapon !== undefined) {
                                    var which = ROT.RNG.getRangeUniform(0, 1), i;
                                    if(which === 0) {
                                        i = this.dungeon.monsterAt(newPosition.x, newPosition.y).weapon;
                                    } else {
                                        i = this.dungeon.monsterAt(newPosition.x, newPosition.y).armour;
                                    }
                                    
                                    if(this.dungeon.itemAt(newPosition.x, newPosition.y) === undefined) {
                                        i.x = newPosition.x;
                                        i.y = newPosition.y;
                                    } else {
                                        var dir, tries = 0, tempPosition = {
                                            x: undefined,
                                            y: undefined
                                        };
                                        while((i.x === undefined && i.y === undefined) || tries < 8) {
                                            switch(tries) {
                                                case ROT.NORTH:
                                                    tempPosition.x = newPosition.x;
                                                    tempPosition.y = newPosition.y - 1;
                                                    break;
                                                case ROT.NORTH_EAST:
                                                    tempPosition.x = newPosition.x + 1;
                                                    tempPosition.y = newPosition.y - 1;
                                                    break;
                                                case ROT.EAST:
                                                    tempPosition.x = newPosition.x + 1;
                                                    tempPosition.y = newPosition.y;
                                                    break;
                                                case ROT.SOUTH_EAST:
                                                    tempPosition.x = newPosition.x + 1;
                                                    tempPosition.y = newPosition.y + 1;
                                                    break;
                                                case ROT.SOUTH:
                                                    tempPosition.x = newPosition.x;
                                                    tempPosition.y = newPosition.y + 1;
                                                    break;
                                                case ROT.SOUTH_WEST:
                                                    tempPosition.x = newPosition.x - 1;
                                                    tempPosition.y = newPosition.y + 1;
                                                    break;
                                                case ROT.WEST:
                                                    tempPosition.x = newPosition.x - 1;
                                                    tempPosition.y = newPosition.y;
                                                    break;
                                                case ROT.NORTH_WEST:
                                                    tempPosition.x = newPosition.x - 1;
                                                    tempPosition.y = newPosition.y - 1;
                                            }
                                            if(this.dungeon.itemAt(tempPosition.x, tempPosition.y) === undefined && this.dungeon.cells[tempPosition.x][tempPosition.y].solid === false) {
                                                i.x = tempPosition.x;
                                                i.y = tempPosition.y;
                                            }
                                            tries += 1;
                                        }
                                    }
                                    if(i.x !== undefined && i.y !== undefined) {
                                        this.dungeon.items.push(i);
                                    }
                                }
                                
                                this.dungeon.removeMonsterAt(newPosition.x, newPosition.y);
                                if(this.dungeon.cells[newPosition.x][newPosition.y].id === Tile.FLOOR.id) {
                                    this.dungeon.cells[newPosition.x][newPosition.y] = Tile.BLOOD_STAINED_FLOOR;
                                }
                            }
                    
                        } else {
                            // TODO: Notify user about you hitting but not dealing any damage
                        }
                    } else {
                        // TODO: Notify user about you missing
                    }
                    
                    // update all other entities
                    this.turn();
                }
            }
            //this.dungeon.updateVisitedCells(this.fov);
            
            // Check for special behaviour on tiles
            switch(this.dungeon.cells[this.player.x][this.player.y].id) {
                case Tile.BARS_DOOR.id:
                    this.dungeon.cells[this.player.x][this.player.y] = Tile.BARS_DOOR_OPEN;
                    break;
                case Tile.DOOR.id:
                    this.dungeon.cells[this.player.x][this.player.y] = Tile.DOOR_OPEN;
                    break;
                case Tile.MONSTER_SPAWNER.id:
                    if(this.player.armour.id !== 'icyveins') {
                        // spawn monsters
                        this.dungeon.monsters.push(new Monster(this.player.x + 1, this.player.y, Monsters.random(this.dungeon.level)));
                        this.dungeon.monsters.push(new Monster(this.player.x, this.player.y + 1, Monsters.random(this.dungeon.level)));
                        this.dungeon.monsters.push(new Monster(this.player.x - 1, this.player.y, Monsters.random(this.dungeon.level)));
                        this.dungeon.monsters.push(new Monster(this.player.x, this.player.y - 1, Monsters.random(this.dungeon.level)));
                        
                        // TODO: Notify user about you triggering the monster trap
                    } else {
                        // TODO: Notify user about you noticing the monster trap
                    }
                    this.dungeon.cells[this.player.x][this.player.y] = Tile.FLOOR;
                    break;
                /*case Tile.BOSS_SECOND_DOOR.id:
                    this.dungeon.cells[this.player.x][this.player.y] = Tile.BOSS_HALLWAY;
                    
                    var i;
                    for(i = 0; i < this.dungeon.monsters.length; i += 1) {
                        if(this.dungeon.monsters[i].name === 'Dragon') {
                            this.dungeon.monsters[i].startTurn = this.turnCounter;
                        }
                    }
                    
                    break;
                case Tile.BOSS_FLOOR.id:
                    
                    if(this.bossClosed === false) {
                        var x, y;
                        for(x = 0; x < this.dungeon.width; x += 1) {
                            for(y = 0; y < this.dungeon.height; y += 1) {
                                if(this.dungeon.cells[x][y].id === Tile.BOSS_HALLWAY.id) {
                                    this.dungeon.cells[x][y] = Tile.WALL;
                                }
                            }
                        }
                        this.bossClosed = true;
                    }
                
                    break;*/
                case Tile.FIREBALL.id:
                    this.player.health -= 2;
                    this.player.lastHitPro = 'by stepping into';
                    this.player.lastHit = 'a fire';
                    // TODO: Notify user about taking 2 damage from the fire
                    break;
            }
            
            this.shouldRender = true;
        }
        
        this.updateAmulet();
        
        this.shouldRender = true;
        
        // Update the interface
        this.updateInterface();
    
    }
};