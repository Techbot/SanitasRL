/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
var Dungeon = function() {
    'use strict';

    // The width and height of the dungeon
    this.width = 60;
    this.height = 60; //36

    // The depth level of this dungeon
    // The generate function generates a more difficult dungeon the higher this number is
    this.level = 1;

    // Features
    this.feature = {
        NORMAL: 0,
        TRAPPED_TREASURE: 1,
        WATER_TREASURE: 2,
        SHRINE: 3,
        MONSTER_TREASURE: 4,
        PILLAR: 5,
        BOSS: 6
    };

    // Dungeon cells
    this.cells = [];

    // monsters
    this.monsters = [];

    // items
    this.items = [];

    // inverted fog of war (array of points that has been visited (seen by the FOV))
    this.visited = [];

    this.bossGenerated = false;

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

Dungeon.prototype.generate = function() {
    'use strict';

    this.bossGenerated = false;

    // Remove everything from the current cells
    var x, y;
    for(x = 0; x < this.width; x += 1) {
        this.cells[x] = [];
        for(y = 0; y < this.height; y += 1) {
            this.cells[x][y] = Tile.EMPTY;
        }
    }

    // clear the visited cells
    for(x = 0; x < this.width; x += 1) {
        this.visited[x] = [];
        for(y = 0; y < this.height; y += 1) {
            this.visited[x][y] = false;
        }
    }

    // Clear the monster arrays
    this.monsters = [];
    this.items = [];

    // 1. Generate a single room in the center of the map
    var centerX = Math.floor(this.width / 2),
        centerY = Math.floor(this.height / 2),
        room = this.generateRectangle();

    this.placeRoom(centerX - Math.floor(room.width / 2), centerY - Math.floor(room.height / 2), centerX + Math.floor(room.width / 2), centerY + Math.floor(room.height / 2), this.feature.NORMAL);

    // 2. Generate x-number of rooms
    // If a room cannot be generated in n-number of tries, it's considered impossible and the algorithm is completed
    var numberOfTries = 0;

    while(numberOfTries < 1000) {

        // 3. Pick a wall of any room
        var randomX = Math.adjustedRandom(0, this.width - 1),
            randomY = Math.adjustedRandom(0, this.height - 1),
            direction,                      // The direction of the new room
            corner = 0,                     // Number of surrounding empty cells, used to detemine if the cell is a corner wall
            startX, startY, endX, endY;     // The start and ending X and Y coordinates of the new room

        // Continue if the selected cell is not a wall, is a corner wall or there's no empty cell adjacent to it
        if(this.cells[randomX][randomY] === Tile.WALL) {

            // Check if the selected cell is a corner wall
            // A corner wall always have 2 empty cells adjecent to it while a normal wall only have one
            if(this.cells[randomX - 1][randomY] === Tile.EMPTY) {
                corner += 1;
            }
            if(this.cells[randomX + 1][randomY] === Tile.EMPTY) {
                corner += 1;
            }
            if(this.cells[randomX][randomY + 1] === Tile.EMPTY) {
                corner += 1;
            }
            if(this.cells[randomX][randomY - 1] === Tile.EMPTY) {
                corner += 1;
            }
            if(corner >= 2) {
                numberOfTries += 1;
                continue;
            }

            room = this.generateRectangle();
            // Check if there is an empty adjecent cells and which direction it is in
            if(this.cells[randomX][randomY - 1] === Tile.EMPTY) {
                // NORTH
                direction = Direction.NORTH;

                startX = randomX - Math.floor(room.width / 2);
                startY = randomY - 1 - room.height;
                endX = randomX + Math.floor(room.width / 2);
                endY = randomY - 2;
            } else if(this.cells[randomX + 1][randomY] === Tile.EMPTY) {
                // EAST
                direction = Direction.EAST;

                startX = randomX + 2;
                startY = randomY - Math.floor(room.height / 2);
                endX = randomX + 1 + room.width;
                endY = randomY + Math.floor(room.height / 2);
            } else if(this.cells[randomX][randomY + 1] === Tile.EMPTY) {
                // SOUTH
                direction = Direction.SOUTH;

                startX = randomX - Math.floor(room.width / 2);
                startY = randomY + 2;
                endX = randomX + Math.floor(room.width / 2);
                endY = randomY + 1 + room.height;
            } else if(this.cells[randomX - 1][randomY] === Tile.EMPTY) {
                // WEST
                direction = Direction.WEST;

                startX = randomX - 1 - room.width;
                startY = randomY - Math.floor(room.height / 2);
                endX = randomX - 2;
                endY = randomY + Math.floor(room.height / 2);
            } else {
                numberOfTries += 1;
                continue;
            }

        } else {
            continue;
        }

        // 4. Check if there is enough room for the new room
        var possible = true;
        for(x = startX - 1; x <= endX + 1; x += 1) {
            for(y = startY - 1; y <= endY + 1; y += 1) {
                // Check if the x / y coordinates are out of bounds or if the x, y is not empty
                if(x < 0 || y < 0 || x >= this.width || y >= this.height || this.cells[x][y] !== Tile.EMPTY) {
                    possible = false;
                }
            }
        }
        if(possible === false) {
            continue;
        }

        // 5. Select a feature to add to the room
        // We have a room.width and room.height
        // Different feature for different sizes?

        // Check if the selected feature fits in the room, otherwise select another feature

        var feature;
        if(room.width === 11 && room.height === 11) {
            if(this.level === 5 && this.bossGenerated === false) {
                feature = this.feature.BOSS;
                this.bossGenerated = true;
            } else {
                feature = this.feature.PILLAR;
            }
        } else {
            var fits = false;
            while(fits === false) {
                feature = Math.adjustedRandom(0, 4);
                switch(feature) {
                    case this.feature.NORMAL:
                        fits = true;
                        break;
                    case this.feature.WATER_TREASURE:
                    case this.feature.TRAPPED_TREASURE:
                        if(room.width >= 9 && room.height >= 9) {
                            fits = true;
                        }
                        break;
                    case this.feature.MONSTER_TREASURE:
                        // random because there was just too many rooms of this kind
                        if(Math.adjustedRandom(0, 2) === 0 && ((room.width >= 7 && room.height >= 7) || (room.width >= 7 && room.height >= 5))) {
                            fits = true;
                        }
                        break;
                    case this.feature.SHRINE:
                        if(room.width === 5 && room.height === 5) {
                            fits = true;
                        }
                        break;
                }
            }
        }

        // Which cell should be used for the corridor?
        var corridorCell,
            floorCell = Tile.FLOOR,
            random = Math.adjustedRandom(0, 5);

        if(feature === this.feature.BOSS) {
            corridorCell = Tile.BOSS_DOOR;
            floorCell = Tile.BOSS_FLOOR;
        } else {
            switch(random) {
                case 0:
                    corridorCell = Tile.TRAP;
                    break;
                case 1:
                case 2:
                    corridorCell = Tile.DOOR;
                    break;
                default:
                    corridorCell = Tile.FOV_FIX;
            }
        }

        // 6. Place the room in the dungeon
        this.placeRoom(startX, startY, endX, endY, feature);

        // 7. Add a corridor between the new and old room
        this.cells[randomX][randomY] = Tile.FLOOR;
        switch(direction) {
            case Direction.NORTH:
                // Floor
                this.cells[randomX][randomY - 1] = corridorCell;
                this.cells[randomX][randomY - 2] = floorCell;
                // Walls
                this.cells[randomX + 1][randomY - 1] = Tile.WALL;
                this.cells[randomX - 1][randomY - 1] = Tile.WALL;
                break;
            case Direction.EAST:
                // Floor
                this.cells[randomX + 1][randomY] = corridorCell;
                this.cells[randomX + 2][randomY] = floorCell;
                // Walls
                this.cells[randomX + 1][randomY + 1] = Tile.WALL;
                this.cells[randomX + 1][randomY - 1] = Tile.WALL;
                break;
            case Direction.SOUTH:
                // Floor
                this.cells[randomX][randomY + 1] = corridorCell;
                this.cells[randomX][randomY + 2] = floorCell;
                // Walls
                this.cells[randomX + 1][randomY + 1] = Tile.WALL;
                this.cells[randomX - 1][randomY + 1] = Tile.WALL;
                break;
            case Direction.WEST:
                // Floor
                this.cells[randomX - 1][randomY] = corridorCell;
                this.cells[randomX - 2][randomY] = floorCell;
                // Walls
                this.cells[randomX - 1][randomY + 1] = Tile.WALL;
                this.cells[randomX - 1][randomY - 1] = Tile.WALL;
                break;
        }

    }

    // 8. Place some stairs (4 of them)
    if(this.level < 5) {
        var i, j;
        
        // put in 4 stairs
        for(j = 0; j < 4; j += 1) {
        
        
            do {
                // different quadrants of the dungeon
                switch(j) {
                    // #####
                    // #0 1#
                    // #2 3#
                    // #####
                    case 0:
                        randomX = Math.adjustedRandom(1, this.width / 2);
                        randomY = Math.adjustedRandom(1, this.height / 2);
                        break;
                    case 1:
                        randomX = Math.adjustedRandom(this.width / 2, this.width - 2);
                        randomY = Math.adjustedRandom(1, this.height / 2);
                        break;
                    case 2:
                        randomX = Math.adjustedRandom(1, this.width / 2);
                        randomY = Math.adjustedRandom(this.height / 2, this.height - 2);
                        break;
                    case 3:
                        randomX = Math.adjustedRandom(this.width / 2, this.width - 2);
                        randomY = Math.adjustedRandom(this.height / 2, this.height - 2);
                        break;
                }
                i = 0;

                // Check if the cells around is empty
                for(x = randomX - 1; x <= randomX + 1; x += 1) {
                    for(y = randomY - 1; y <= randomY + 1; y += 1) {
                        if(this.cells[x][y].id === Tile.FLOOR.id) {
                            i += 1;
                        }
                    }
                }

                // Check if the stairs is too close to the player
                if((x > Math.floor(this.width / 2) - 10 && x < Math.floor(this.width / 2) + 10) || (y > Math.floor(this.height / 2) - 10 && y < Math.floor(this.height / 2) + 10)) {
                    i = 0;
                }
            } while(i < 9);

            this.cells[randomX][randomY] = Tile.STAIRS;
            
            
        }
    }

    // 9. Place items
    var item, placed, rx, ry, free;
    for(i = 0; i < 20; i += 1) {
        placed = false;
        do {
            free = true;

            rx = Math.adjustedRandom(2, this.width - 2);
            ry = Math.adjustedRandom(2, this.height - 2);
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

    // 10. Place monsters
    /*for(i = 0; i < 50; i += 1) {
        placed = false;
        do {

            rx = Math.adjustedRandom(2, this.width - 2);
            ry = Math.adjustedRandom(2, this.height - 2);
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
    }*/

    // 11. regenerate if boss wasn't generated on level 5
    if(this.level === 5 && this.bossGenerated === false) {
        this.generate();
    }
    
    this.cells[0][0].id = Tile.FLOOR;
};

/*
 * Generates a width and height to be used for a room
 */
Dungeon.prototype.generateRectangle = function() {
    'use strict';

    var minSize = 5,
        maxSize = 11,
        room = {
            width: Math.adjustedRandom(minSize, maxSize),
            height: Math.adjustedRandom(minSize, maxSize)
        };

    while(room.width % 2 === 0) {
        room.width = Math.adjustedRandom(minSize, maxSize);
    }

    while(room.height % 2 === 0) {
        room.height = Math.adjustedRandom(minSize, maxSize);
    }

    return room;
};

/*
 * Places a rectangle room with the specified point in the top-left corner, or with the specified point in the center
 */
Dungeon.prototype.placeRoom = function(startX, startY, endX, endY, feature) {
    'use strict';

    //
    var x, y,
        centerX = startX + ((endX - startX) / 2),
        centerY = startY + ((endY - startY) / 2);

    // add fov fix around the boss room
    if(feature === this.feature.BOSS) {
        for(x = startX - 1; x <= endX + 1; x += 1) {
            for(y = startY - 1; y <= endY + 1; y += 1) {
                if(x === startX - 1 || y === startY - 1 || x === endX + 1 || y === endY + 1) {
                    this.cells[x][y] = Tile.BOSS_FOV_FIX;
                }
            }
        }
    }

    for(x = startX; x <= endX; x += 1) {
        for(y = startY; y <= endY; y += 1) {

            switch(feature) {
                case this.feature.BOSS:

                    // should be circle

                    // fill with floor
                    if(x === startX || y === startY || x === endX || y === endY) {
                        this.cells[x][y] = Tile.BOSS_FOV_FIX;
                    } else {
                        this.cells[x][y] = Tile.BOSS_FLOOR;
                    }

                    var cy = y - startY,
                        cx = x - startX;

                    switch(cy) {
                        case 0:
                        case 10:
                            if(cx > 1 && cx < 9) {
                                this.cells[x][y] = Tile.BOSS_WALL;
                            }
                            break;

                        case 1:
                        case 9:
                            if(cx === 1 || cx === 2 || cx === 8 || cx === 9) {
                                this.cells[x][y] = Tile.BOSS_WALL;
                            }
                            break;

                        case 2:
                        case 8:
                            if(cx === 0 || cx === 1 || cx === 9 || cx === 10) {
                                this.cells[x][y] = Tile.BOSS_WALL;
                            }
                            if(cx === 2 || cx === 8) {
                                this.cells[x][y] = Tile.SHRINE;
                            }
                            break;

                        default:
                            if(cx === 0 || cx === 10) {
                                this.cells[x][y] = Tile.BOSS_WALL;
                            }
                            break;
                    }

                    // add boss
                    if(x === centerX && y === centerY) {
                        this.monsters.push(new Monster(centerX, centerY, Monsters.dragon));
                    }

                    break;
                case this.feature.NORMAL:
                    // Walls
                    if(x === startX || y === startY || x === endX || y === endY) {
                        this.cells[x][y] = Tile.WALL;
                    // Floor
                    } else {
                        this.cells[x][y] = Tile.FLOOR;
                    }
                    break;
                case this.feature.TRAPPED_TREASURE:
                    // Walls
                    if(x === startX
                        || y === startY
                        || x === endX
                        || y === endY) {
                        this.cells[x][y] = Tile.WALL;
                    // Bars
                    } else if((y === centerY - 1 && (x === centerX - 1 || x === centerX || x === centerX + 1))
                        || (y === centerY && (x === centerX - 1 || x === centerX + 1))
                        || (y === centerY + 1 && (x === centerX - 1 || x === centerX + 1))) {
                        this.cells[x][y] = Tile.BARS;
                    // Center (Treasure)
                    } else if(x === centerX && y === centerY) {
                        this.cells[x][y] = Tile.FLOOR;

                        var r = Math.adjustedRandom(0, 100);
                        if(r > 65) {
                            this.items.push(new Item(x, y, Items.random(undefined, 6))); // unique
                        } else {
                            this.items.push(new Item(x, y, Items.random(undefined, this.level + 1))); // dungeon level + 1
                        }
                    // (Trap) door
                    } else if(y === centerY + 1 && x === centerX) {
                        if(Math.adjustedRandom(0, 4) === 0) {
                            this.cells[x][y] = Tile.BARS_DOOR;
                        } else {
                            this.cells[x][y] = Tile.BARS_TRAP;
                        }
                    // Floor
                    } else {
                        this.cells[x][y] = Tile.FLOOR;
                    }
                    break;
                case this.feature.WATER_TREASURE:
                    // Walls
                    if(x === startX
                        || y === startY
                        || x === endX
                        || y === endY) {
                        this.cells[x][y] = Tile.WALL;
                    // Water
                    } else if((y === centerY - 1 && (x === centerX - 1 || x === centerX || x === centerX + 1))
                        || (y === centerY && (x === centerX - 1 || x === centerX + 1))
                        || (y === centerY + 1 && (x === centerX - 1 || x === centerX || x === centerX + 1))) {
                        this.cells[x][y] = Tile.WATER;
                    // Center (Treasure)
                    } else if(x === centerX && y === centerY) {
                        this.cells[x][y] = Tile.FLOOR;

                        var r = Math.adjustedRandom(0, 100);
                        if(r > 90) {
                            this.items.push(new Item(x, y, Items.random(undefined, this.level + 1))); // dungeon level + 1
                        } else if(r > 75) {
                            this.items.push(new Item(x, y, Items.random(undefined, this.level + 2))); // dungeon level + 2
                        } else {
                            this.items.push(new Item(x, y, Items.random(undefined, 6))); // unique
                        }
                    // Floor
                    } else {
                        this.cells[x][y] = Tile.FLOOR;
                    }
                    break;
                case this.feature.SHRINE:
                    if(x === startX || y === startY || x === endX || y === endY) {
                        this.cells[x][y] = Tile.WALL;
                    } else if(x === centerX && y === centerY) {
                        this.cells[x][y] = Tile.SHRINE;
                    } else {
                        this.cells[x][y] = Tile.FLOOR;
                    }
                    break;
                case this.feature.PILLAR:
                    if(x === startX || y === startY || x === endX || y === endY) {
                        this.cells[x][y] = Tile.WALL;
                    } else if(x === startX + 3 && y === startY + 3) {
                        this.cells[x][y] = Tile.PILLAR;
                    } else if(x === startX + 5 && y === startY + 3) {
                        this.cells[x][y] = Tile.PILLAR;
                    } else if(x === startX + 7 && y === startY + 3) {
                        this.cells[x][y] = Tile.PILLAR;
                    } else if(x === startX + 3 && y === startY + 5) {
                        this.cells[x][y] = Tile.PILLAR;
                    } else if(x === startX + 7 && y === startY + 5) {
                        this.cells[x][y] = Tile.PILLAR;
                    } else if(x === startX + 3 && y === startY + 7) {
                        this.cells[x][y] = Tile.PILLAR;
                    } else if(x === startX + 5 && y === startY + 7) {
                        this.cells[x][y] = Tile.PILLAR;
                    } else if(x === startX + 7 && y === startY + 7) {
                        this.cells[x][y] = Tile.PILLAR;
                    } else {
                        this.cells[x][y] = Tile.FLOOR;
                    }
                    break;
                case this.feature.MONSTER_TREASURE:
                    // Walls
                    if(x === startX || y === startY || x === endX || y === endY) {
                        this.cells[x][y] = Tile.WALL;
                    // Floor
                    } else if(x === centerX && y === centerY) {
                        this.cells[x][y] = Tile.MONSTER_SPAWNER;

                        var r = Math.adjustedRandom(0, 100);
                        if(r > 50) {
                            this.items.push(new Item(x, y, Items.random(undefined, 6))); // unique
                        } else {
                            this.items.push(new Item(x, y, Items.random(undefined, this.level + 1))); // dungeon level + 1
                        }
                    } else {
                        this.cells[x][y] = Tile.FLOOR;
                    }
                    break;
            }
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