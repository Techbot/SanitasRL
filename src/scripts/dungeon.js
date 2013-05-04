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
};
