var Dungeon = function() {
    'use strict';
    this.width = 60;
    this.height = 36;

    this.levels = [];
};

var Level = function() {
    this.cells = [];
    this.seenCells = []; // All cells that we have seen (used for fog of war)
};

// Returns the tile at position x, y
Dungeon.prototype.at = function(x, y, level) {
    if(this.levels[level].cells[x][y] !== null) {
        return {
            x: this.levels[level].cells[x][y].image.x,
            y: this.levels[level].cells[x][y].image.y,
            color: this.levels[level].cells[x][y].color
        };
    }

    return null;
};

// returns all possible locations to place the player
Dungeon.prototype.generate = function(game) {
        // Level 5 should work differently, we should generate a large room on level 5 for the boss
        this.levels[game.level] = new Level();
        
        var generator;
        if(ROT.RNG.getInt(0, 1) === 1) {
            generator = new ROT.Map.Uniform(this.width, this.height);
        } else {
            generator = new ROT.Map.Digger(this.width, this.height);
        }

        var x, y;
        for(x = 0; x < this.width; x += 1) {
            this.levels[game.level].cells[x] = [];
            this.levels[game.level].seenCells[x] = [];
            for(y = 0; y < this.height; y += 1) {
                this.levels[game.level].cells[x][y] = null;
                this.levels[game.level].seenCells[x][y] = false;
            }
        }

        var generatorCallback = function(x, y, value) {
            if(value === 0) {
                this.levels[game.level].cells[x][y] = Tile.FLOOR;
            }
        };

        generator.create(generatorCallback.bind(this));

        var rooms = generator.getRooms().randomize(), i;
        for(i = 0; i < rooms.length; i += 1) {
            // Add DOWNWARD_STAIRCASE to the first room
            var dx = rooms[i]._x2 - rooms[i]._x1,
                dy = rooms[i]._y2 - rooms[i]._y1,
                cx = rooms[i]._x1 + Math.ceil(dx / 2),
                cy = rooms[i]._y1 + Math.ceil(dy / 2);

            if(i === 0) {
                this.levels[game.level].cells[cx][cy] = Tile.DOWNWARD_STAIRCASE;
            } else {
                var done = false;

                while(done === false) {
                    switch(ROT.RNG.getInt(0, 4)) {
                        case 0: // Water treasure
                            if(dx >= 4 && dy >= 4) {
                                this.levels[game.level].cells[cx][cy - 1] = Tile.WATER;
                                this.levels[game.level].cells[cx + 1][cy - 1] = Tile.WATER;
                                this.levels[game.level].cells[cx + 1][cy] = Tile.WATER;
                                this.levels[game.level].cells[cx + 1][cy + 1] = Tile.WATER;
                                this.levels[game.level].cells[cx][cy + 1] = Tile.WATER;
                                this.levels[game.level].cells[cx - 1][cy + 1] = Tile.WATER;
                                this.levels[game.level].cells[cx - 1][cy] = Tile.WATER;
                                this.levels[game.level].cells[cx - 1][cy - 1] = Tile.WATER;

                                done = true;
                            }
                            break;
                        case 1: // Trapped treasure
                            if(dx >= 4 && dy >= 4) {
                                this.levels[game.level].cells[cx][cy - 1] = Tile.WALL;
                                this.levels[game.level].cells[cx + 1][cy - 1] = Tile.WALL;
                                this.levels[game.level].cells[cx + 1][cy] = Tile.WALL;
                                this.levels[game.level].cells[cx + 1][cy + 1] = Tile.WALL;
                                this.levels[game.level].cells[cx][cy + 1] = Tile.DOOR;
                                this.levels[game.level].cells[cx - 1][cy + 1] = Tile.WALL;
                                this.levels[game.level].cells[cx - 1][cy] = Tile.WALL;
                                this.levels[game.level].cells[cx - 1][cy - 1] = Tile.WALL;

                                done = true;
                            }
                                done = true;
                            break;
                        case 2: // Shrine
                            this.levels[game.level].cells[cx][cy] = Tile.WELL;
                            done = true;
                            break;
                        case 3: // Pillar
                            if(dx >= 4 && dy >= 4) {
                                this.levels[game.level].cells[cx + 1][cy - 1] = Tile.PILLAR;
                                this.levels[game.level].cells[cx + 1][cy + 1] = Tile.PILLAR;
                                this.levels[game.level].cells[cx - 1][cy + 1] = Tile.PILLAR;
                                this.levels[game.level].cells[cx - 1][cy - 1] = Tile.PILLAR;
                                done = true;
                            }
                            break;
                        case 4: // grass
                            for(x = rooms[i]._x1; x <= rooms[i]._x2; x += 1) {
                                for(y = rooms[i]._y1; y <= rooms[i]._y2; y += 1) {
                                    if(ROT.RNG.getInt(0, 1) === 0) {
                                        this.levels[game.level].cells[x][y] = Tile.GRASS;
                                    } else {
                                        this.levels[game.level].cells[x][y] = Tile.FOILAGE;
                                    }
                                }
                            }
                            done = true;
                            break;
                    }
                }
            }

            // Loop over the rooms
            // Obligatory features:
            //  DOWNWARD_STAIRCASE down

        }

        var x, y;
        for(x = 1; x < this.width - 1; x += 1) {
            for(y = 1; y < this.height - 1; y += 1) {
                if(this.levels[game.level].cells[x][y] !== null && this.levels[game.level].cells[x][y].id !== Tile.WALL.id) {
                    // North
                    if(this.levels[game.level].cells[x][y - 1] === null) {
                        this.levels[game.level].cells[x][y - 1] = Tile.WALL;
                    }

                    // North East
                    if(this.levels[game.level].cells[x + 1][y - 1] === null) {
                        this.levels[game.level].cells[x + 1][y - 1] = Tile.WALL;
                    }

                    // East
                    if(this.levels[game.level].cells[x + 1][y] === null) {
                        this.levels[game.level].cells[x + 1][y] = Tile.WALL;
                    }

                    // South East
                    if(this.levels[game.level].cells[x + 1][y + 1] === null) {
                        this.levels[game.level].cells[x + 1][y + 1] = Tile.WALL;
                    }

                    // South
                    if(this.levels[game.level].cells[x][y + 1] === null) {
                        this.levels[game.level].cells[x][y + 1] = Tile.WALL;
                    }

                    // South West
                    if(this.levels[game.level].cells[x - 1][y + 1] === null) {
                        this.levels[game.level].cells[x - 1][y + 1] = Tile.WALL;
                    }

                    // West
                    if(this.levels[game.level].cells[x - 1][y] === null) {
                        this.levels[game.level].cells[x - 1][y] = Tile.WALL;
                    }

                    // North West
                    if(this.levels[game.level].cells[x - 1][y - 1] === null) {
                        this.levels[game.level].cells[x - 1][y - 1] = Tile.WALL;
                    }
                }
            }
        }

        for(i = 0; i < rooms.length; i += 1) {
            var door;
            for(var door in rooms[i]._doors) {
                if(rooms[i]._doors.hasOwnProperty(door)) {
                    var d = door.split(',');
                    this.levels[game.level].cells[parseInt(d[0], 10)][parseInt(d[1], 10)] = Tile.DOOR;
                }
            }
        }
        // Find the first used cell (x, y)
        var first_x, last_x, first_y, last_y;
        for(x = 0; x < this.width; x += 1) {
            for(y = 0; y < this.height; y += 1) {
                if(this.levels[game.level].cells[x][y] !== null && first_x === undefined) {
                    first_x = x;
                }
            }
        }

        for(x = this.width - 1; x > 0; x -= 1) {
            for(y = 0; y < this.height; y += 1) {
                if(this.levels[game.level].cells[x][y] !== null && last_x === undefined) {
                    last_x = x + 1;
                }
            }
        }

        for(y = 0; y < this.height; y += 1) {
            for(x = 0; x < this.width; x += 1) {
                if(this.levels[game.level].cells[x][y] !== null && first_y === undefined) {
                    first_y = y;
                }
            }
        }

        for(y = this.height - 1; y > 0; y -= 1) {
            for(x = this.width - 1; x > 0; x -= 1) {
                if(this.levels[game.level].cells[x][y] !== null && last_y === undefined) {
                    last_y = y + 1;
                }
            }
        }

        // These are indeces, i.e. they start at 0
        this.tmp = this.levels[game.level].cells.slice(first_x, last_x);
        for(x = 0; x < this.tmp.length; x += 1) {
            this.tmp[x] = this.tmp[x].slice(first_y, last_y);
        }

        var offset_x = Math.floor((59 - (this.tmp.length - 1)) / 2);
        var offset_y = Math.floor((35 - (this.tmp[0].length - 1)) / 2);

        // Place the tmp array into the center of the cells array
        for(x = 0; x < this.width; x += 1) {
            for(y = 0; y < this.height; y += 1) {
                this.levels[game.level].cells[x][y] = null;

                //
                if(x >= offset_x && y >= offset_y && x < this.tmp.length + offset_x && y < this.tmp[0].length + offset_y) {
                    this.levels[game.level].cells[x][y] = this.tmp[x - offset_x][y - offset_y];
                }
            }
        }

        var floors = [];
        for(x = 0; x < this.width; x += 1) {
            for(y = 0; y < this.height; y += 1) {
                if(this.levels[game.level].cells[x][y] !== null && this.levels[game.level].cells[x][y].entityPasses === true) {
                    floors.push({ x: x, y: y });
                }
            }
        }

        // Loop over everything placing lights
        for(x = 0; x < this.width; x += 1) {
            for(y = 0; y < this.height; y += 1) {
                if(this.levels[game.level].cells[x][y] !== null && this.levels[game.level].cells[x][y].light !== undefined) {
                    game.lighting.setLight(x, y, this.levels[game.level].cells[x][y].light);
                }
            }
        }

        // Return a random floor tile for the player to start at
        return floors.random();
};
