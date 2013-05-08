var Dungeon = function() {
    'use strict';
    this.width = 60;
    this.height = 36;
    this.level = 1;
    
    this.cells = [];
    this.monsters = [];
    this.items = [];
    
    this.generate();
};

Dungeon.prototype.monsterAt = function(x, y) {
    'use strict';

    var i;
    for(i = 0; i < this.monsters.length; i += 1) {
        if(this.monsters[i].x === x && this.monsters[i].y === y) {
            return this.monsters[i];
        }
    }

    return undefined;
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

Dungeon.prototype.removeMonsterAt = function(x, y) {
    'use strict';

    var i;
    for(i = 0; i < this.monsters.length; i += 1) {
        if(this.monsters[i].x === x && this.monsters[i].y === y) {
            this.monsters.splice(i, 1);
            return true;
        }
    }
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

/*
 * Updates the visited cells to include the passed bounds
 */
Dungeon.prototype.updateVisitedCells = function(bounds) {
    var x, y;
    for(x = bounds.x; x < bounds.x + bounds.w; x++) {
        for(y = bounds.y; y < bounds.y + bounds.h; y++) {
            this.visited[x][y] = true;
        }
    }
};

Dungeon.prototype.generate = function() {
    // Level 5 should work differently, we should generate a large room on level 5 for the boss
    if(this.level < 5) {
        var generator = new ROT.Map.Digger(this.width, this.height);
        
        var x, y;
        for(x = 0; x < this.width; x += 1) {
            this.cells[x] = [];
            for(y = 0; y < this.height; y += 1) {
                this.cells[x][y] = Tile.EMPTY;
            }
        }
        
        var generatorCallback = function(x, y, value) {
            if(value === 0) {
                this.cells[x][y] = Tile.FLOOR;
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
        
        var item, placed, rx, ry, free;
        for(i = 0; i < 10; i += 1) {
            placed = false;
            do {
                free = true;

                rx = ROT.RNG.getInt(2, this.width - 2);
                ry = ROT.RNG.getInt(2, this.height - 2);
                item = new Item(rx, ry, Items.random(undefined, this.level));

                if(rx !== Math.floor(this.width / 2) && ry !== Math.floor(this.height / 2)
                    && this.cells[rx][ry].id === Tile.FLOOR.id              // Tile is a floor
                    && this.cells[rx + 1][ry].id === Tile.FLOOR.id      // Adjacent tiles are floor
                    && this.cells[rx - 1][ry].id === Tile.FLOOR.id
                    && this.cells[rx][ry + 1].id === Tile.FLOOR.id
                    && this.cells[rx][ry - 1].id === Tile.FLOOR.id
                    && this.itemAt(rx, ry) === undefined) {             // No item at the position

                    // loop and see if there is a similar item within 10 tiles
                    for(x = rx - 5; x < rx + 5; x += 1) {
                        for(y = ry - 5; y < ry + 5; y += 1) {
                            if(this.itemAt(x, y) !== undefined && this.itemAt(x, y).type === item.type) {
                                free = false;
                            }
                        }
                    }

                    if(free === true) {
                        this.items.push(item);
                        placed = true;
                    }
                }

            } while(placed === false);
        }
        
        // Place monsters
        this.monsters.length = 0;
        
        for(i = 0; i < 20; i += 1) {
            placed = false;
            do {

                rx = ROT.RNG.getInt(2, this.width - 2);
                ry = ROT.RNG.getInt(2, this.height - 2);
                if(rx !== Math.floor(this.width / 2) && ry !== Math.floor(this.height / 2)
                    && this.cells[rx][ry].id === Tile.FLOOR.id
                    && this.cells[rx + 1][ry].id === Tile.FLOOR.id
                    && this.cells[rx - 1][ry].id === Tile.FLOOR.id
                    && this.cells[rx][ry + 1].id === Tile.FLOOR.id
                    && this.cells[rx][ry - 1].id === Tile.FLOOR.id
                    && this.monsterAt(rx, ry) === undefined) {
                    
                    if(rx < Math.floor(this.width / 2) - 5 || rx > Math.floor(this.width / 2) + 5 || ry < Math.floor(this.height / 2) - 5 || ry > Math.floor(this.height / 2) + 5) {
                        this.monsters.push(new Monster(rx, ry, Monsters.random(this.level)));
                        placed = true;
                    }
                }

            } while(placed === false);
        }
    // Level 5
    } else {
        var generator = new ROT.Map.Cellular(this.width - 4, this.height - 4);
        generator.randomize(0.5);
        
        var x, y;
        for(x = 0; x < this.width; x += 1) {
            this.cells[x] = [];
            for(y = 0; y < this.height; y += 1) {
                this.cells[x][y] = Tile.EMPTY;
                
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
        
        this.monsters.push(new Monster(ROT.RNG.getInt(2, this.width - 4), ROT.RNG.getInt(2, this.height - 4), Monsters.dragon));
        this.items.push(new Item(2, 2, Items.random(undefined, this.level + 1))); // dungeon level + 1
        this.items.push(new Item(2, 3, Items.random(undefined, this.level + 1))); // dungeon level + 1
        this.items.push(new Item(2, 4, Items.random(undefined, this.level + 1))); // dungeon level + 1
        this.items.push(new Item(2, 5, Items.random(undefined, this.level + 1))); // dungeon level + 1
        this.items.push(new Item(2, 6, Items.random(undefined, this.level + 1))); // dungeon level + 1
    }
    
    var x, y;
    for(x = 1; x < this.width - 1; x += 1) {
        for(y = 1; y < this.height - 1; y += 1) {            
            if(this.cells[x][y].id === Tile.FLOOR.id) {
                // North
                if(this.cells[x][y - 1].id === Tile.EMPTY.id) {
                    this.cells[x][y - 1] = Tile.WALL;
                }
                
                // North East
                if(this.cells[x + 1][y - 1].id === Tile.EMPTY.id) {
                    this.cells[x + 1][y - 1] = Tile.WALL;
                }
                
                // East
                if(this.cells[x + 1][y].id === Tile.EMPTY.id) {
                    this.cells[x + 1][y] = Tile.WALL;
                }
                
                // South East
                if(this.cells[x + 1][y + 1].id === Tile.EMPTY.id) {
                    this.cells[x + 1][y + 1] = Tile.WALL;
                }
                
                // South
                if(this.cells[x][y + 1].id === Tile.EMPTY.id) {
                    this.cells[x][y + 1] = Tile.WALL;
                }
                
                // South West
                if(this.cells[x - 1][y + 1].id === Tile.EMPTY.id) {
                    this.cells[x - 1][y + 1] = Tile.WALL;
                }
                
                // West
                if(this.cells[x - 1][y].id === Tile.EMPTY.id) {
                    this.cells[x - 1][y] = Tile.WALL;
                }
                
                // North West
                if(this.cells[x - 1][y - 1].id === Tile.EMPTY.id) {
                    this.cells[x - 1][y - 1] = Tile.WALL;
                }
            }
        }
    }
};
