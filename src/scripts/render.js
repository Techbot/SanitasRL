/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
/*Game.prototype.pointIsInsideFOV = function(x, y) {
    'use strict';

    if(x >= this.fov.x && x < this.fov.x + this.fov.w
        && y >= this.fov.y && y < this.fov.y + this.fov.h) {
        return true;
    }

    return false;
};

Game.prototype.calculateFOV = function() {
    'use strict';

    var bounds = {
        x: undefined,
        y: undefined,
        w: undefined,
        h: undefined
    },
    position = {
        x: this.player.x,
        y: this.player.y
    };

    do {
        position.x -= 1;
    } while(this.dungeon.cells[position.x][position.y].transparent === true);
    bounds.x = position.x;

    position.x = this.player.x;
    do {
        position.y -= 1;
    } while(this.dungeon.cells[position.x][position.y].transparent === true);
    bounds.y = position.y;

    position = {
        x: this.player.x,
        y: this.player.y
    };

    do {
        position.x += 1;
    } while(this.dungeon.cells[position.x][position.y].transparent === true);
    bounds.w = (position.x - bounds.x) + 1;

    position.x = this.player.x;
    do {
        position.y += 1;
    } while(this.dungeon.cells[position.x][position.y].transparent === true);
    bounds.h = (position.y - bounds.y) + 1;

    return bounds;
};

Game.prototype.renderFOV = function(bounds) {
    'use strict';

    this.fovoverlay.clearRect(0, 0, 960, 576);

    this.fovoverlay.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.fovoverlay.fillRect(0, 0, 960, 576);
    this.fovoverlay.save();
    this.fovoverlay.globalCompositeOperation = 'destination-out';
    this.fovoverlay.fillStyle = '#fff';

    this.fovoverlay.fillRect((bounds.x - this.camera.x) * this.tileSize, (bounds.y - this.camera.y) * this.tileSize, bounds.w * this.tileSize, bounds.h * this.tileSize);

    this.fovoverlay.restore();
};*/

Game.prototype.newRender = function() {
    this.canvas.clearRect(0, 0, 960, 576);
    
    /*var x, y, tile;
    for(x = 0; x < 60; x += 1) {
        for(y = 0; y < 36; y += 1) {
            // Draw monster (Highest priority)
            if(this.dungeon.monsterAt(x, y)) {
                tile = this.dungeon.monsterAt(x, y);
                this.canvas.drawImage(this.image.monsters, tile.image.x * 16, tile.image.y * 16, 16, 16, tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);
            // Draw item
            } else if(this.dungeon.itemAt(x, y)) {
                tile = this.dungeon.itemAt(x, y);
                this.canvas.drawImage(this.image.items, tile.image.x * 16, tile.image.y * 16, 16, 16, tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);
            // Draw tile (Lowest priority)
            } else {
            }
        }
    }*/
    
    // Background
    var x, y, t;
    for(x = 0; x < 60; x += 1) {
        for(y = 0; y < 36; y += 1) {
            //if(x > 0 && y > 0 && x < this.dungeon.width && y < this.dungeon.height) {

                if(this.dungeon.cells[x][y].id !== Tile.EMPTY.id && this.dungeon.cells[x][y].id !== Tile.BOSS_FOV_FIX.id) {
                    t = this.dungeon.cells[x][y].image(Tile.EMPTY, this.player);
                    this.canvas.drawImage(this.images.tileset, t.x * 16, t.y * 16, 16, 16, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }

            //}
        }
    }
    
    // Foreground
    var i, t;
    // Items
    for(i = 0; i < this.dungeon.items.length; i += 1) {
        if(this.dungeon.items[i].x >= this.camera.x
            && this.dungeon.items[i].x <= this.camera.x2
            && this.dungeon.items[i].y >= this.camera.y
            && this.dungeon.items[i].y <= this.camera.y2
            /*&& this.dungeon.visited[this.dungeon.items[i].x][this.dungeon.items[i].y] === true*/) {

            t = this.dungeon.items[i].image;
            this.canvas.drawImage(this.images.items, t.x * 16, t.y * 16, 16, 16, this.dungeon.items[i].x * this.tileSize, this.dungeon.items[i].y * this.tileSize, this.tileSize, this.tileSize);
        }
    }

    // Monsters
    for(i = 0; i < this.dungeon.monsters.length; i += 1) {
        if(this.dungeon.monsters[i].x >= this.camera.x
            && this.dungeon.monsters[i].x <= this.camera.x2
            && this.dungeon.monsters[i].y >= this.camera.y
            && this.dungeon.monsters[i].y <= this.camera.y2
            /*&& this.pointIsInsideFOV(this.dungeon.monsters[i].x, this.dungeon.monsters[i].y)*/) {

            t = this.dungeon.monsters[i].image;
            this.canvas.drawImage(this.images.monsters, t.x * 16, t.y * 16, 16, 16, this.dungeon.monsters[i].x * this.tileSize, this.dungeon.monsters[i].y * this.tileSize, this.tileSize, this.tileSize);

        }
    }

    //this.canvas.drawImage(this.images.player, (this.player.x - this.camera.x) * this.tileSize, (this.player.y - this.camera.y) * this.tileSize);
    this.canvas.drawImage(this.images.player, 0, 0, 16, 16, this.player.x * this.tileSize, this.player.y * this.tileSize, this.tileSize, this.tileSize);
    
    if(this.mode === this.modes.LOOK || this.mode === this.modes.TELEKINESIS) {
        this.canvas.strokeStyle = '#0f0';
        this.canvas.lineWidth = 2;
        this.canvas.strokeRect(this.cursor.x * this.tileSize + 1, this.cursor.y * this.tileSize + 1, this.tileSize - 2, this.tileSize - 2);
    }
};
