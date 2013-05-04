/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
Game.prototype.renderBackground = function() {
    'use strict';

    this.background.clearRect(0, 0, this.width.px, this.height.px);

    var x, y, t;
    for(x = this.camera.x; x <= this.camera.x2; x += 1) {
        for(y = this.camera.y; y <= this.camera.y2; y += 1) {
            if(x > 0 && y > 0 && x < this.dungeon.width && y < this.dungeon.height && this.dungeon.visited[x][y] === true) {

                if(this.dungeon.cells[x][y].id !== Tile.EMPTY.id && this.dungeon.cells[x][y].id !== Tile.BOSS_FOV_FIX.id) {
                    t = this.dungeon.cells[x][y].image(this.dungeon.cells[x][y + 1].id, this.player);
                    this.background.drawImage(this.images.tileset, t.x * this.tileSize, t.y * this.tileSize, this.tileSize, this.tileSize, (x - this.camera.x) * this.tileSize, (y - this.camera.y) * this.tileSize, this.tileSize, this.tileSize);
                }

            }
        }
    }
};

Game.prototype.renderForeground = function() {
    'use strict';

    this.foreground.clearRect(0, 0, this.width.px, this.height.px);

    var i, t;
    // Items
    for(i = 0; i < this.dungeon.items.length; i += 1) {
        if(this.dungeon.items[i].x >= this.camera.x
            && this.dungeon.items[i].x <= this.camera.x2
            && this.dungeon.items[i].y >= this.camera.y
            && this.dungeon.items[i].y <= this.camera.y2
            && this.dungeon.visited[this.dungeon.items[i].x][this.dungeon.items[i].y] === true) {

            t = this.dungeon.items[i].image;
            this.foreground.drawImage(this.images.items, t.x * 32, t.y * 32, 32, 32, (this.dungeon.items[i].x - this.camera.x) * this.tileSize, (this.dungeon.items[i].y - this.camera.y) * this.tileSize, this.tileSize, this.tileSize);
        }
    }

    // Monsters
    for(i = 0; i < this.dungeon.monsters.length; i += 1) {
        if(this.dungeon.monsters[i].x >= this.camera.x
            && this.dungeon.monsters[i].x <= this.camera.x2
            && this.dungeon.monsters[i].y >= this.camera.y
            && this.dungeon.monsters[i].y <= this.camera.y2
            && this.pointIsInsideFOV(this.dungeon.monsters[i].x, this.dungeon.monsters[i].y)) {

            t = this.dungeon.monsters[i].image;
            this.foreground.drawImage(this.images.monsters, t.x * 32, t.y * 32, 32, 32, (this.dungeon.monsters[i].x - this.camera.x) * this.tileSize, (this.dungeon.monsters[i].y - this.camera.y) * this.tileSize, this.tileSize, this.tileSize);

        }
    }

    this.foreground.drawImage(this.images.player, (this.player.x - this.camera.x) * this.tileSize, (this.player.y - this.camera.y) * this.tileSize);
    
    if(this.mode === this.modes.LOOK || this.mode === this.modes.TELEKINESIS) {
        this.foreground.strokeStyle = '#0f0';
        this.foreground.lineWidth = 2;
        this.foreground.strokeRect((this.cursor.x - this.camera.x) * this.tileSize + 1, (this.cursor.y - this.camera.y) * this.tileSize + 1, this.tileSize - 2, this.tileSize - 2);
    }
};

Game.prototype.pointIsInsideFOV = function(x, y) {
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

    this.fovoverlay.clearRect(0, 0, this.width.px, this.height.px);

    this.fovoverlay.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.fovoverlay.fillRect(0, 0, this.width.px, this.height.px);
    this.fovoverlay.save();
    this.fovoverlay.globalCompositeOperation = 'destination-out';
    this.fovoverlay.fillStyle = '#fff';

    this.fovoverlay.fillRect((bounds.x - this.camera.x) * this.tileSize, (bounds.y - this.camera.y) * this.tileSize, bounds.w * this.tileSize, bounds.h * this.tileSize);

    this.fovoverlay.restore();
};

Game.prototype.newRender = function(fov) {
    this.canvas.clearRect(0, 0, this.width.px, this.height.px);
    
    // Background
    var x, y, t;
    for(x = this.camera.x; x <= this.camera.x2; x += 1) {
        for(y = this.camera.y; y <= this.camera.y2; y += 1) {
            if(x > 0 && y > 0 && x < this.dungeon.width && y < this.dungeon.height && this.dungeon.visited[x][y] === true) {

                if(this.dungeon.cells[x][y].id !== Tile.EMPTY.id && this.dungeon.cells[x][y].id !== Tile.BOSS_FOV_FIX.id) {
                    t = this.dungeon.cells[x][y].image(this.dungeon.cells[x][y + 1].id, this.player);
                    this.canvas.drawImage(this.images.tileset, t.x * this.tileSize, t.y * this.tileSize, this.tileSize, this.tileSize, (x - this.camera.x) * this.tileSize, (y - this.camera.y) * this.tileSize, this.tileSize, this.tileSize);
                }

            }
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
            && this.dungeon.visited[this.dungeon.items[i].x][this.dungeon.items[i].y] === true) {

            t = this.dungeon.items[i].image;
            this.canvas.drawImage(this.images.items, t.x * 32, t.y * 32, 32, 32, (this.dungeon.items[i].x - this.camera.x) * this.tileSize, (this.dungeon.items[i].y - this.camera.y) * this.tileSize, this.tileSize, this.tileSize);
        }
    }

    // Monsters
    for(i = 0; i < this.dungeon.monsters.length; i += 1) {
        if(this.dungeon.monsters[i].x >= this.camera.x
            && this.dungeon.monsters[i].x <= this.camera.x2
            && this.dungeon.monsters[i].y >= this.camera.y
            && this.dungeon.monsters[i].y <= this.camera.y2
            && this.pointIsInsideFOV(this.dungeon.monsters[i].x, this.dungeon.monsters[i].y)) {

            t = this.dungeon.monsters[i].image;
            this.canvas.drawImage(this.images.monsters, t.x * 32, t.y * 32, 32, 32, (this.dungeon.monsters[i].x - this.camera.x) * this.tileSize, (this.dungeon.monsters[i].y - this.camera.y) * this.tileSize, this.tileSize, this.tileSize);

        }
    }

    this.canvas.drawImage(this.images.player, (this.player.x - this.camera.x) * this.tileSize, (this.player.y - this.camera.y) * this.tileSize);
    
    if(this.mode === this.modes.LOOK || this.mode === this.modes.TELEKINESIS) {
        this.canvas.strokeStyle = '#0f0';
        this.canvas.lineWidth = 2;
        this.canvas.strokeRect((this.cursor.x - this.camera.x) * this.tileSize + 1, (this.cursor.y - this.camera.y) * this.tileSize + 1, this.tileSize - 2, this.tileSize - 2);
    }
};
