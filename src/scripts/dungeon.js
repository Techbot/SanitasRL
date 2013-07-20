var Dungeon = function() {
    'use strict';
    this.width = 50;
    this.height = 36;

    this.levels = [];
};

var Level = function(length) {
    'use strict';
    this.cells = [];
    this.explored = [];
    this.startingPosition = { x: undefined, y: undefined };
    this.endingPosition = { x: undefined, y: undefined };
    this.creatures = [];

    var i;
    for(i = 0; i < length; i += 1) {
        this.cells[i] = [];
        this.explored[i] = [];
    }
};

Dungeon.prototype.at = function(x, y, level) {
    'use strict';
    for(var i = 0; i < this.levels[level].creatures.length; i++) {
        if(this.levels[level].creatures[i].x === x && this.levels[level].creatures[i].y === y) {
            return this.levels[level].creatures[i].image;
        }
    }

    if(this.levels[level].cells[x][y].id !== Tile.EMPTY.id) {
        return this.levels[level].cells[x][y].image;
    }

    return null;
};

Dungeon.prototype.generate = function(game) {
    'use strict';
    this.levels[game.level] = new Level(this.width);
    var level = this.levels[game.level],
        i, j, x, y;

    // Generate the digger porition of the level
    var generator = new ROT.Map.Digger(this.width, this.height);
    generator.create(function(x, y, value) {
        level.cells[x][y] = (value === 0) ? Tile.FLOOR : Tile.EMPTY;
    }.bind(this));
    var rooms = generator.getRooms().randomize();

    // Generate the cellular porition of the level
    var offset = { x: undefined, y: undefined }, cellular = [],
        create = function(x, y, value) {
            if(value === 1) {
                level.cells[x + offset.x][y + offset.y] = Tile.FLOOR;//Tile.CELLULAR_HIGHLIGHT;
                cellular.push({ x: x + offset.x, y: y + offset.y });
            }
        };

    for(i = 0; i < 3; i += 1) {
        generator = new ROT.Map.Cellular(ROT.RNG.getInt(10, 20), ROT.RNG.getInt(10, 20));
        generator.randomize(0.5);

        for(j = 0; j < 4; j += 1) {
            generator.create();
        }

        offset.x = ROT.RNG.getInt(2, this.width - 20 - 2); // Width - maximum cullular size - 2 for walls
        offset.y = ROT.RNG.getInt(2, this.height - 20 - 2); // Height - maximum cellular size - 2 for walls

        generator.create(create);
    }

    // Add oasis-like growth in the cellular porition of the level
    var growth = {
        origin: cellular.random(),
        size: ROT.RNG.getInt(5, 15),
        start: { x: undefined, y: undefined },
        type: (ROT.RNG.getInt(0, 1) === 1 ? Tile.OPIUM_PLANT : Tile.COCA_PLANT)
    }, grass = [];
    growth.start.x = growth.origin.x - Math.floor(growth.size / 2);
    growth.start.y = growth.origin.y - Math.floor(growth.size / 2);

    for(x = growth.start.x; x < growth.start.x + growth.size; x += 1) {
        for(y = growth.start.y; y < growth.start.y + growth.size; y += 1) {
            var distance = Math.sqrt(Math.pow(growth.origin.x - x, 2) + Math.pow(growth.origin.y - y, 2));

            if(x === growth.origin.x && y === growth.origin.y) {
                level.cells[x][y] = Tile.WATER;
            } else if((level.cells[x][y] === Tile.CELLULAR_HIGHLIGHT || level.cells[x][y] === Tile.ROOM_HIGHLIGHT || level.cells[x][y] === Tile.FLOOR) && distance <= Math.floor(growth.size / 2)) {
                level.cells[x][y] = Tile.GRASS;
                grass.push({ x: x, y: y });
            }
        }
    }

    for(i = 0; i < 5; i += 1) {
        var tile = grass.random();
        level.cells[tile.x][tile.y] = growth.type;
    }

    // Loop over the rooms
    var width, height, center;

    for(i = 0; i < rooms.length; i += 1) {
        // Get width, height and center of the room
        width = (rooms[i]._x2 - rooms[i]._x1) + 1;
        height = (rooms[i]._y2 - rooms[i]._y1) + 1;
        center = { x: rooms[i]._x1 + Math.floor(width / 2), y: rooms[i]._y1 + Math.floor(height / 2) };

        // Pillar tomb
        if(width % 2 !== 0 && height % 2 !== 0 && width >= 5 && height >= 5) {
            level.cells[center.x][center.y] = Tile.WELL;
            level.cells[center.x - 1][center.y - 1] = Tile.PILLAR;
            level.cells[center.x + 1][center.y - 1] = Tile.PILLAR;
            level.cells[center.x + 1][center.y + 1] = Tile.PILLAR;
            level.cells[center.x - 1][center.y + 1] = Tile.PILLAR;
        // Well room
        } else if(ROT.RNG.getInt(0, 5) === 0 && width % 2 !== 0 && height % 2 !== 0) {
            level.cells[center.x][center.y] = Tile.WELL;
        }
    }

    // Add walls to all border tiles
    for(x = 1; x < this.width - 1; x += 1) {
        for(y = 1; y < this.height - 1; y += 1) {
            if(level.cells[x][y].id !== Tile.EMPTY.id && level.cells[x][y].id !== Tile.WALL.id) {
                // North
                if(level.cells[x][y - 1].id === Tile.EMPTY.id) {
                    level.cells[x][y - 1] = Tile.WALL;
                }

                // North East
                if(level.cells[x + 1][y - 1].id === Tile.EMPTY.id) {
                    level.cells[x + 1][y - 1] = Tile.WALL;
                }

                // East
                if(level.cells[x + 1][y].id === Tile.EMPTY.id) {
                    level.cells[x + 1][y] = Tile.WALL;
                }

                // South East
                if(level.cells[x + 1][y + 1].id === Tile.EMPTY.id) {
                    level.cells[x + 1][y + 1] = Tile.WALL;
                }

                // South
                if(level.cells[x][y + 1].id === Tile.EMPTY.id) {
                    level.cells[x][y + 1] = Tile.WALL;
                }

                // South West
                if(level.cells[x - 1][y + 1].id === Tile.EMPTY.id) {
                    level.cells[x - 1][y + 1] = Tile.WALL;
                }

                // West
                if(level.cells[x - 1][y].id === Tile.EMPTY.id) {
                    level.cells[x - 1][y] = Tile.WALL;
                }

                // North West
                if(level.cells[x - 1][y - 1].id === Tile.EMPTY.id) {
                    level.cells[x - 1][y - 1] = Tile.WALL;
                }
            }
        }
    }

    // Loop over all rooms, adding doors
    for(i = 0; i < rooms.length; i += 1) {
        var door;
        for(door in rooms[i]._doors) {
            if(rooms[i]._doors.hasOwnProperty(door)) {
                var door_x = parseInt(door.split(',')[0], 10),
                    door_y = parseInt(door.split(',')[1], 10);

                // There seems to be a bug where doors can be added in illogical places.
                // Therefore, we need to check if the door is places between two walls:
                //
                //         #
                //  #+# or +
                //         #
                if(
                    // #+#
                    (level.cells[door_x - 1][door_y].id === Tile.WALL.id && level.cells[door_x + 1][door_y].id === Tile.WALL.id)

                    ||

                    // #
                    // +
                    // #
                    (level.cells[door_x][door_y - 1].id === Tile.WALL.id && level.cells[door_x][door_y + 1].id === Tile.WALL.id)
                ) {
                    // There also seems to be a bug where two doors can be placed subsequent
                    // to each other, or very close to eachother. We therefore need to check
                    // if there is a door adjacent to the one we're placing
                    if(
                        level.cells[door_x][door_y - 1].id !== Tile.DOOR.id
                        && level.cells[door_x + 1][door_y - 1].id !== Tile.DOOR.id
                        && level.cells[door_x + 1][door_y].id !== Tile.DOOR.id
                        && level.cells[door_x + 1][door_y + 1].id !== Tile.DOOR.id
                        && level.cells[door_x][door_y + 1].id !== Tile.DOOR.id
                        && level.cells[door_x - 1][door_y + 1].id !== Tile.DOOR.id
                        && level.cells[door_x - 1][door_y].id !== Tile.DOOR.id
                        && level.cells[door_x - 1][door_y - 1].id !== Tile.DOOR.id
                    ) {
                        level.cells[door_x][door_y] = Tile.DOOR;
                    }
                }
            }
        }
    }

    var walls = [];
    for(x = 0; x < this.width; x += 1) {
        for(y = 0; y < this.height; y += 1) {
            if(level.cells[x][y].id === Tile.WALL.id) {
                walls.push({ x: x, y: y });
            }
        }
    }

    // Add a downward stairwell
    var done = false, wall;
    while(done === false) {
        wall = walls.random();

        // See if the wall is eligble to host a stairwell
        if(wall.x > 1 && wall.y > 1 && wall.x < this.width - 1 && wall.y < this.height - 1) {
            // North
            if(
                    (level.cells[wall.x - 1][wall.y - 1].id === Tile.EMPTY.id   || level.cells[wall.x - 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y - 1].id === Tile.EMPTY.id       || level.cells[wall.x][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y - 1].id === Tile.EMPTY.id   || level.cells[wall.x + 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x - 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x + 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y + 1].entityPasses === true) // The tile below is walkable
            ) {
                level.cells[wall.x - 1][wall.y - 1] = Tile.WALL;
                level.cells[wall.x][wall.y - 1] = Tile.WALL;
                level.cells[wall.x + 1][wall.y - 1] = Tile.WALL;
                level.cells[wall.x - 1][wall.y] = Tile.WALL;
                level.cells[wall.x][wall.y] = Tile.DOWNWARD_STAIRCASE;
                level.cells[wall.x + 1][wall.y] = Tile.WALL;
                done = true;
            }

            // East
            if(
                    (level.cells[wall.x + 1][wall.y - 1].id === Tile.EMPTY.id   || level.cells[wall.x + 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x + 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y + 1].id === Tile.EMPTY.id   || level.cells[wall.x + 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y - 1].id === Tile.EMPTY.id       || level.cells[wall.x][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y + 1].id === Tile.EMPTY.id        || level.cells[wall.x][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y].entityPasses === true) // The tile to the left is walkable
            ) {
                level.cells[wall.x + 1][wall.y - 1] = Tile.WALL;
                level.cells[wall.x + 1][wall.y] = Tile.WALL;
                level.cells[wall.x + 1][wall.y + 1] = Tile.WALL;
                level.cells[wall.x][wall.y - 1] = Tile.WALL;
                level.cells[wall.x][wall.y] = Tile.DOWNWARD_STAIRCASE;
                level.cells[wall.x][wall.y + 1] = Tile.WALL;
                done = true;
            }

            // South
            if(
                    (level.cells[wall.x - 1][wall.y + 1].id === Tile.EMPTY.id   || level.cells[wall.x - 1][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y + 1].id === Tile.EMPTY.id       || level.cells[wall.x][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y + 1].id === Tile.EMPTY.id   || level.cells[wall.x + 1][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x - 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x + 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y - 1].entityPasses === true) // The tile below is walkable
            ) {
                level.cells[wall.x - 1][wall.y + 1] = Tile.WALL;
                level.cells[wall.x][wall.y + 1] = Tile.WALL;
                level.cells[wall.x + 1][wall.y + 1] = Tile.WALL;
                level.cells[wall.x - 1][wall.y] = Tile.WALL;
                level.cells[wall.x][wall.y] = Tile.DOWNWARD_STAIRCASE;
                level.cells[wall.x + 1][wall.y] = Tile.WALL;
                done = true;
            }

            // West
            if(
                    (level.cells[wall.x - 1][wall.y - 1].id === Tile.EMPTY.id   || level.cells[wall.x - 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x - 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y + 1].id === Tile.EMPTY.id   || level.cells[wall.x - 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y - 1].id === Tile.EMPTY.id       || level.cells[wall.x][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y + 1].id === Tile.EMPTY.id        || level.cells[wall.x][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y].entityPasses === true) // The tile to the left is walkable
            ) {
                level.cells[wall.x - 1][wall.y - 1] = Tile.WALL;
                level.cells[wall.x - 1][wall.y] = Tile.WALL;
                level.cells[wall.x - 1][wall.y + 1] = Tile.WALL;
                level.cells[wall.x][wall.y - 1] = Tile.WALL;
                level.cells[wall.x][wall.y] = Tile.DOWNWARD_STAIRCASE;
                level.cells[wall.x][wall.y + 1] = Tile.WALL;
                done = true;
            }
        }
    }

    // Add a upward stairwell
    done = false, wall = undefined;
    while(done === false) {
        wall = walls.random();

        // See if the wall is eligble to host a stairwell
        if(wall.x > 1 && wall.y > 1 && wall.x < this.width - 1 && wall.y < this.height - 1) {
            // North
            if(
                    (level.cells[wall.x - 1][wall.y - 1].id === Tile.EMPTY.id   || level.cells[wall.x - 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y - 1].id === Tile.EMPTY.id       || level.cells[wall.x][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y - 1].id === Tile.EMPTY.id   || level.cells[wall.x + 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x - 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x + 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y + 1].entityPasses === true) // The tile below is walkable
            ) {
                level.cells[wall.x - 1][wall.y - 1] = Tile.WALL;
                level.cells[wall.x][wall.y - 1] = Tile.WALL;
                level.cells[wall.x + 1][wall.y - 1] = Tile.WALL;
                level.cells[wall.x - 1][wall.y] = Tile.WALL;
                level.cells[wall.x][wall.y] = (game.level === 1) ? Tile.ENTRANCE : Tile.UPWARD_STAIRCASE;
                level.cells[wall.x + 1][wall.y] = Tile.WALL;

                done = true;
            }

            // East
            if(
                    (level.cells[wall.x + 1][wall.y - 1].id === Tile.EMPTY.id   || level.cells[wall.x + 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x + 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y + 1].id === Tile.EMPTY.id   || level.cells[wall.x + 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y - 1].id === Tile.EMPTY.id       || level.cells[wall.x][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y + 1].id === Tile.EMPTY.id        || level.cells[wall.x][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y].entityPasses === true) // The tile to the left is walkable
            ) {
                level.cells[wall.x + 1][wall.y - 1] = Tile.WALL;
                level.cells[wall.x + 1][wall.y] = Tile.WALL;
                level.cells[wall.x + 1][wall.y + 1] = Tile.WALL;
                level.cells[wall.x][wall.y - 1] = Tile.WALL;
                level.cells[wall.x][wall.y] = (game.level === 1) ? Tile.ENTRANCE : Tile.UPWARD_STAIRCASE;
                level.cells[wall.x][wall.y + 1] = Tile.WALL;

                done = true;
            }

            // South
            if(
                    (level.cells[wall.x - 1][wall.y + 1].id === Tile.EMPTY.id   || level.cells[wall.x - 1][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y + 1].id === Tile.EMPTY.id       || level.cells[wall.x][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y + 1].id === Tile.EMPTY.id   || level.cells[wall.x + 1][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x - 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x + 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y - 1].entityPasses === true) // The tile below is walkable
            ) {
                level.cells[wall.x - 1][wall.y + 1] = Tile.WALL;
                level.cells[wall.x][wall.y + 1] = Tile.WALL;
                level.cells[wall.x + 1][wall.y + 1] = Tile.WALL;
                level.cells[wall.x - 1][wall.y] = Tile.WALL;
                level.cells[wall.x][wall.y] = (game.level === 1) ? Tile.ENTRANCE : Tile.UPWARD_STAIRCASE;
                level.cells[wall.x + 1][wall.y] = Tile.WALL;

                done = true;
            }

            // West
            if(
                    (level.cells[wall.x - 1][wall.y - 1].id === Tile.EMPTY.id   || level.cells[wall.x - 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y].id === Tile.EMPTY.id       || level.cells[wall.x - 1][wall.y].id === Tile.WALL.id)
                &&  (level.cells[wall.x - 1][wall.y + 1].id === Tile.EMPTY.id   || level.cells[wall.x - 1][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y - 1].id === Tile.EMPTY.id       || level.cells[wall.x][wall.y - 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x][wall.y + 1].id === Tile.EMPTY.id        || level.cells[wall.x][wall.y + 1].id === Tile.WALL.id)
                &&  (level.cells[wall.x + 1][wall.y].entityPasses === true) // The tile to the left is walkable
            ) {
                level.cells[wall.x - 1][wall.y - 1] = Tile.WALL;
                level.cells[wall.x - 1][wall.y] = Tile.WALL;
                level.cells[wall.x - 1][wall.y + 1] = Tile.WALL;
                level.cells[wall.x][wall.y - 1] = Tile.WALL;
                level.cells[wall.x][wall.y] = (game.level === 1) ? Tile.ENTRANCE : Tile.UPWARD_STAIRCASE;
                level.cells[wall.x][wall.y + 1] = Tile.WALL;

                done = true;
            }
        }
    }


    // Find the first used cell (x, y)
    var first_x, last_x, first_y, last_y;
    for(x = 0; x < this.width; x += 1) {
        for(y = 0; y < this.height; y += 1) {
            if(level.cells[x][y].id !== Tile.EMPTY.id && first_x === undefined) {
                first_x = x;
            }
        }
    }

    for(x = this.width - 1; x > 0; x -= 1) {
        for(y = 0; y < this.height; y += 1) {
            if(level.cells[x][y].id !== Tile.EMPTY.id && last_x === undefined) {
                last_x = x + 1;
            }
        }
    }

    for(y = 0; y < this.height; y += 1) {
        for(x = 0; x < this.width; x += 1) {
            if(level.cells[x][y].id !== Tile.EMPTY.id && first_y === undefined) {
                first_y = y;
            }
        }
    }

    for(y = this.height - 1; y > 0; y -= 1) {
        for(x = this.width - 1; x > 0; x -= 1) {
            if(level.cells[x][y].id !== Tile.EMPTY.id && last_y === undefined) {
                last_y = y + 1;
            }
        }
    }

    // These are indeces, i.e. they start at 0
    this.tmp = level.cells.slice(first_x, last_x);
    for(x = 0; x < this.tmp.length; x += 1) {
        this.tmp[x] = this.tmp[x].slice(first_y, last_y);
    }

    var offset_x = Math.floor((this.width - 1 - (this.tmp.length - 1)) / 2);
    var offset_y = Math.floor((this.height - 1 - (this.tmp[0].length - 1)) / 2);

    // Place the tmp array into the center of the cells array
    for(x = 0; x < this.width; x += 1) {
        for(y = 0; y < this.height; y += 1) {
            level.cells[x][y] = Tile.EMPTY;

            //
            if(x >= offset_x && y >= offset_y && x < this.tmp.length + offset_x && y < this.tmp[0].length + offset_y) {
                level.cells[x][y] = this.tmp[x - offset_x][y - offset_y];

                if(level.cells[x][y].id === Tile.UPWARD_STAIRCASE.id || level.cells[x][y].id === Tile.ENTRANCE.id) {
                    level.startingPosition = { x: x, y: y };
                } else if(level.cells[x][y].id === Tile.DOWNWARD_STAIRCASE.id) {
                    level.endingPosition = { x: x, y: y };
                }
            }
        }
    }

    var floors = [];
    for(x = 0; x < this.width; x += 1) {
        for(y = 0; y < this.height; y += 1) {
            if(level.cells[x][y].entityPasses === true) {
                floors.push({ x: x, y: y });
            }
        }
    }

    // Loop over everything placing lights and creatures
    for(x = 0; x < this.width; x += 1) {
        for(y = 0; y < this.height; y += 1) {
            if(level.cells[x][y].light !== undefined) {
                game.lighting.setLight(x, y, level.cells[x][y].light);
            }

            if(level.cells[x][y].spawnable === true && ROT.RNG.getPercentage() < 5) {
                level.creatures.push(new Creature(x, y));
            }
        }
    }

    var dijkstra = new ROT.Path.Dijkstra(level.endingPosition.x, level.endingPosition.y, function(x, y) {
        if(level.cells[x][y].id === Tile.DOOR.id || level.cells[x][y].entityPasses === true) {
            return true;
        }

        return false;
    });

    var possible = false;
    dijkstra.compute(level.startingPosition.x, level.startingPosition.y, function() {
        // If this function is called, we've reached our destination and do not need to redo the level
        possible = true;
    });

    if(possible === false) {
        this.generate(game);
    }
};
