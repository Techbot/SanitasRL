var Dungeon = function() {
    'use strict';
    this.width = 60;
    this.height = 36;
    this.level = 1;
    
    this.cells = [];
    this.seenCells = []; // All cells that we have seen (used for fog of war)
    this.items = [];
    
    this.shadowcasting = new ROT.FOV.PreciseShadowcasting(this.lightPasses.bind(this));
    for(this.fov = []; this.fov.length < this.width; this.fov.push([])); // generate a 2d array
    
    this.generate();
};

Dungeon.prototype.itemAt = function(x, y) {
    'use strict';

    var i;
    for(i = 0; i < this.items.length; i += 1) {
        if(this.items[i].x === x && this.items[i].y === y) {
            return this.items[i];
        }
    }

    return undefined;
};

Dungeon.prototype.replaceItemAt = function(x, y, item) {
    'use strict';

    var i;
    for(i = 0; i < this.items.length; i += 1) {
        if(this.items[i].x === x && this.items[i].y === y) {
           this.items[i] = item;
        }
    }
};

Dungeon.prototype.lightPasses = function(x, y) {
    if(x > 0 && x < this.width && y > 0 && y < this.height && this.cells[x][y] !== null) {
        return Tile[this.cells[x][y]].lightPasses;
    }
    
    return false;
};

Dungeon.prototype.generateFOV = function(x, y) {
    var ex, ey;
    for(ex = 0; ex < this.width; ex += 1) {
        for(ey = 0; ey < this.height; ey += 1) {
            this.fov[ex][ey] = false;
        }
    }

    this.shadowcasting.compute(x, y, 10, function(x, y, r, visibility) {
        if(r === 0) {
            this.fov[x][y] = 1;
        } else {
            this.fov[x][y] = (1 / r) * 3;
        }
        
        this.seenCells[x][y] = true;
    }.bind(this));
    
    
};

// Returns the tile and color of the monster, item or tile at position x, y
Dungeon.prototype.at = function(x, y) {
    var item = this.itemAt(x, y),
        tile = this.cells[x][y];

    if(item !== undefined) {
        return {
            x: item.image.x,
            y: item.image.y,
            color: item.color
        };
    } else if(tile !== null) {
        tile = Tile[tile];
        return {
            x: tile.image.x,
            y: tile.image.y,
            color: tile.color
        };
    }
    
    return null;
};

Dungeon.prototype.generate = function() {
    // Level 5 should work differently, we should generate a large room on level 5 for the boss
    if(this.level < 5) {
        var generator = new ROT.Map.Digger(this.width, this.height);
        var floors = [];
        
        var x, y;
        for(x = 0; x < this.width; x += 1) {
            this.cells[x] = [];
            this.seenCells[x] = [];
            for(y = 0; y < this.height; y += 1) {
                this.cells[x][y] = null;
                this.seenCells[x][y] = false;
            }
        }
        
        var generatorCallback = function(x, y, value) {
            if(value === 0) {
                this.cells[x][y] = Tile.FLOOR;
                floors.push({ x: x, y: y });
            }
        };
        
        generator.create(generatorCallback.bind(this));
        
        var rooms = generator.getRooms().randomize(), i;
        for(i = 0; i < rooms.length; i += 1) {
            // Add stairs to the first room
            var dx = rooms[i]._x2 - rooms[i]._x1,
                dy = rooms[i]._y2 - rooms[i]._y1,
                cx = rooms[i]._x1 + Math.ceil(dx / 2),
                cy = rooms[i]._y1 + Math.ceil(dy / 2);
                
            if(i === 0) {
                this.cells[cx][cy] = Tile.STAIRS;
            } else {
                var done = false;
                
                while(done === false) {
                    switch(ROT.RNG.getInt(0, 4)) {
                        case 0: // Water treasure
                            if(dx >= 4 && dy >= 4) {
                                var r = ROT.RNG.getInt(0, 100);
                                if(r > 90) {
                                    this.items.push(new Item(cx, cy, Items.random(undefined, this.level + 1))); // dungeon level + 1
                                } else if(r > 75) {
                                    this.items.push(new Item(cx, cy, Items.random(undefined, this.level + 2))); // dungeon level + 2
                                } else {
                                    this.items.push(new Item(cx, cy, Items.random(undefined, 6))); // unique
                                }
                            
                                this.cells[cx][cy - 1] = Tile.WATER;
                                this.cells[cx + 1][cy - 1] = Tile.WATER;
                                this.cells[cx + 1][cy] = Tile.WATER;
                                this.cells[cx + 1][cy + 1] = Tile.WATER;
                                this.cells[cx][cy + 1] = Tile.WATER;
                                this.cells[cx - 1][cy + 1] = Tile.WATER;
                                this.cells[cx - 1][cy] = Tile.WATER;
                                this.cells[cx - 1][cy - 1] = Tile.WATER;
                            
                                done = true;
                            }
                            break;
                        case 1: // Trapped treasure
                            if(dx >= 4 && dy >= 4) {
                                var r = ROT.RNG.getInt(0, 100);
                                if(r > 65) {
                                    this.items.push(new Item(cx, cy, Items.random(undefined, 6))); // unique
                                } else {
                                    this.items.push(new Item(cx, cy, Items.random(undefined, this.level + 1))); // dungeon level + 1
                                }
                            
                                this.cells[cx][cy - 1] = Tile.BARS;
                                this.cells[cx + 1][cy - 1] = Tile.BARS;
                                this.cells[cx + 1][cy] = Tile.BARS;
                                this.cells[cx + 1][cy + 1] = Tile.BARS;
                                this.cells[cx][cy + 1] = Tile.DOOR;
                                this.cells[cx - 1][cy + 1] = Tile.BARS;
                                this.cells[cx - 1][cy] = Tile.BARS;
                                this.cells[cx - 1][cy - 1] = Tile.BARS;
                            
                                done = true;
                            }
                                done = true;
                            break;
                        case 2: // Monster treasure
                            this.cells[cx][cy] = Tile.MONSTER_SPAWNER;
                            var r = ROT.RNG.getInt(0, 100);
                            if(r > 50) {
                                this.items.push(new Item(cx, cy, Items.random(undefined, 6))); // unique
                            } else {
                                this.items.push(new Item(cx, cy, Items.random(undefined, this.level + 1))); // dungeon level + 1
                            }
                            done = true;
                            break;
                        case 3: // Shrine
                        this.cells[cx][cy] = Tile.SHRINE;
                            done = true;
                            break;
                        case 4: // Pillar
                            if(dx >= 4 && dy >= 4) {
                                this.cells[cx + 1][cy - 1] = Tile.PILLAR;
                                this.cells[cx + 1][cy + 1] = Tile.PILLAR;
                                this.cells[cx - 1][cy + 1] = Tile.PILLAR;
                                this.cells[cx - 1][cy - 1] = Tile.PILLAR;
                                done = true;
                            }
                            break;
                    }
                }
            }
            
            // Loop over the rooms
            // Obligatory features:
            //  Stairs down
            
        }
        
        // Place items
        this.items.length = 0;

        for(i = 0; i < 10; i += 1) {
            // Pick a random floor cell
            var cell = floors.random();
            if(this.itemAt(cell.x, cell.y) === undefined) {
                this.items.push(new Item(cell.x, cell.y, Items.random(undefined, this.level)));
            }
        }
        
    // Level 5
    } else {
        var generator = new ROT.Map.Cellular(this.width - 4, this.height - 4);
        generator.randomize(0.5);
        
        var x, y;
        for(x = 0; x < this.width; x += 1) {
            this.cells[x] = [];
            this.seenCells[x] = [];
            for(y = 0; y < this.height; y += 1) {
                this.cells[x][y] = null;
                this.seenCells[x][y] = false;
                
                if(x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    this.cells[x][y] = Tile.WALL;
                } else if(x === 1 || x === this.width - 2 || y === 1 || y === this.height - 2) {
                    this.cells[x][y] = Tile.FLOOR;
                }
            }
        }
        
        var generatorCallback = function(x, y, value) {
            if(value === 0) {
                this.cells[x + 2][y + 2] = Tile.FLOOR;
            }
        };
        
        generator.create();
        generator.create();
        generator.create();
        generator.create(generatorCallback.bind(this));
        
        this.items.push(new Item(2, 2, Items.random(undefined, this.level + 1))); // dungeon level + 1
        this.items.push(new Item(2, 3, Items.random(undefined, this.level + 1))); // dungeon level + 1
        this.items.push(new Item(2, 4, Items.random(undefined, this.level + 1))); // dungeon level + 1
        this.items.push(new Item(2, 5, Items.random(undefined, this.level + 1))); // dungeon level + 1
        this.items.push(new Item(2, 6, Items.random(undefined, this.level + 1))); // dungeon level + 1
    }
    
    var x, y;
    for(x = 1; x < this.width - 1; x += 1) {
        for(y = 1; y < this.height - 1; y += 1) {            
            if(this.cells[x][y] !== null && this.cells[x][y] === Tile.FLOOR) {
                // North
                if(this.cells[x][y - 1] === null) {
                    this.cells[x][y - 1] = Tile.WALL;
                }
                
                // North East
                if(this.cells[x + 1][y - 1] === null) {
                    this.cells[x + 1][y - 1] = Tile.WALL;
                }
                
                // East
                if(this.cells[x + 1][y] === null) {
                    this.cells[x + 1][y] = Tile.WALL;
                }
                
                // South East
                if(this.cells[x + 1][y + 1] === null) {
                    this.cells[x + 1][y + 1] = Tile.WALL;
                }
                
                // South
                if(this.cells[x][y + 1] === null) {
                    this.cells[x][y + 1] = Tile.WALL;
                }
                
                // South West
                if(this.cells[x - 1][y + 1] === null) {
                    this.cells[x - 1][y + 1] = Tile.WALL;
                }
                
                // West
                if(this.cells[x - 1][y] === null) {
                    this.cells[x - 1][y] = Tile.WALL;
                }
                
                // North West
                if(this.cells[x - 1][y - 1] === null) {
                    this.cells[x - 1][y - 1] = Tile.WALL;
                }
            }
        }
    }
};
