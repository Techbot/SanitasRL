/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
Monster.prototype.pathfind = function(sx, sy, dx, dy, dungeon) {
    'use strict';
    // Returns the next position point A (sx, sy) should move in to reach point B (dx, dy)

    // The suggested new position
    var suggestedPosition = {
            x: sx,
            y: sy
        };
    // The actual new position
    //var newPosition = suggestedPosition;

    // 1. Calculate the direction the destination is in
    if(sx > dx) {
        suggestedPosition.x -= 1;
    } else if(sx < dx) {
        suggestedPosition.x += 1;
    }

    if(sy > dy) {
        suggestedPosition.y -= 1;
    } else if(sy < dy) {
        suggestedPosition.y += 1;
    }

    // 2. If we can move to the new position, do it
    if(dungeon.cells[suggestedPosition.x][suggestedPosition.y].solid === false
        && dungeon.cells[suggestedPosition.x][suggestedPosition.y].id !== Tile.BARS_DOOR
        && dungeon.cells[suggestedPosition.x][suggestedPosition.y].id !== Tile.BARS_TRAP
        && dungeon.cells[suggestedPosition.x][suggestedPosition.y].id !== Tile.BARS_DOOR_OPEN
        && dungeon.cells[suggestedPosition.x][suggestedPosition.y].id !== Tile.BARS_TRAP_SPRUNG
        && dungeon.monsterAt(suggestedPosition.x, suggestedPosition.y) === undefined) {
        return suggestedPosition;
    }

    // 3. If we can't move to the new position

    // Check if we can move left / right
    if(dungeon.cells[suggestedPosition.x][sy].solid === false
        && dungeon.cells[suggestedPosition.x][sy].id !== Tile.BARS_DOOR
        && dungeon.cells[suggestedPosition.x][sy].id !== Tile.BARS_TRAP
        && dungeon.cells[suggestedPosition.x][sy].id !== Tile.BARS_DOOR_OPEN
        && dungeon.cells[suggestedPosition.x][sy].id !== Tile.BARS_TRAP_SPRUNG
        && dungeon.monsterAt(suggestedPosition.x, sy) === undefined) {
        return {
            x: suggestedPosition.x,
            y: sy
        };
    }

    // Check if we can move up / down
    if(dungeon.cells[sx][suggestedPosition.y].solid === false
        && dungeon.cells[sx][suggestedPosition.y].id !== Tile.BARS_DOOR
        && dungeon.cells[sx][suggestedPosition.y].id !== Tile.BARS_TRAP
        && dungeon.cells[sx][suggestedPosition.y].id !== Tile.BARS_DOOR_OPEN
        && dungeon.cells[sx][suggestedPosition.y].id !== Tile.BARS_TRAP_SPRUNG
        && dungeon.monsterAt(sx, suggestedPosition.y) === undefined) {
        return {
            x: sx,
            y: suggestedPosition.y
        };
    }

    // If we cant move in the direction of the player
    // This problem occurs in this situation:
    //
    //     S
    //     #
    //     D
    //
    // The destination is N/E/S/W of the source
    // We cant move N/E/S/W, we should try to move diagonally

    // we should move north / south
    if(suggestedPosition.x === sx
        && (suggestedPosition.y === sy + 1 || suggestedPosition.y === sy - 1)) {
        // try right - diagonally
        if(dungeon.cells[suggestedPosition.x + 1][suggestedPosition.y].solid === false
            && dungeon.cells[suggestedPosition.x + 1][suggestedPosition.y].id !== Tile.BARS_DOOR
            && dungeon.cells[suggestedPosition.x + 1][suggestedPosition.y].id !== Tile.BARS_TRAP
            && dungeon.cells[suggestedPosition.x + 1][suggestedPosition.y].id !== Tile.BARS_DOOR_OPEN
            && dungeon.cells[suggestedPosition.x + 1][suggestedPosition.y].id !== Tile.BARS_TRAP_SPRUNG
            && dungeon.monsterAt(suggestedPosition.x + 1, suggestedPosition.y) === undefined) {
            return {
                x: suggestedPosition.x + 1,
                y: suggestedPosition.y
            };
        }
        // try left - diagonally
        if(dungeon.cells[suggestedPosition.x - 1][suggestedPosition.y].solid === false
            && dungeon.cells[suggestedPosition.x - 1][suggestedPosition.y].id !== Tile.BARS_DOOR
            && dungeon.cells[suggestedPosition.x - 1][suggestedPosition.y].id !== Tile.BARS_TRAP
            && dungeon.cells[suggestedPosition.x - 1][suggestedPosition.y].id !== Tile.BARS_DOOR_OPEN
            && dungeon.cells[suggestedPosition.x - 1][suggestedPosition.y].id !== Tile.BARS_TRAP_SPRUNG
            && dungeon.monsterAt(suggestedPosition.x - 1, suggestedPosition.y) === undefined) {
            return {
                x: suggestedPosition.x - 1,
                y: suggestedPosition.y
            };
        }
    }

    // we should move west / east
    if(suggestedPosition.y === sy
        && (suggestedPosition.x === sx + 1 || suggestedPosition.x === sx - 1)) {
        // try up - diagonally
        if(dungeon.cells[suggestedPosition.x][suggestedPosition.y - 1].solid === false
            && dungeon.cells[suggestedPosition.x][suggestedPosition.y - 1].id !== Tile.BARS_DOOR
            && dungeon.cells[suggestedPosition.x][suggestedPosition.y - 1].id !== Tile.BARS_TRAP
            && dungeon.cells[suggestedPosition.x][suggestedPosition.y - 1].id !== Tile.BARS_DOOR_OPEN
            && dungeon.cells[suggestedPosition.x][suggestedPosition.y - 1].id !== Tile.BARS_TRAP_SPRUNG
            && dungeon.monsterAt(suggestedPosition.x, suggestedPosition.y - 1) === undefined) {
            return {
                x: suggestedPosition.x,
                y: suggestedPosition.y - 1
            };
        }
        // try down - diagonally
        if(dungeon.cells[suggestedPosition.x][suggestedPosition.y + 1].solid === false
            && dungeon.cells[suggestedPosition.x][suggestedPosition.y + 1].id !== Tile.BARS_DOOR
            && dungeon.cells[suggestedPosition.x][suggestedPosition.y + 1].id !== Tile.BARS_TRAP
            && dungeon.cells[suggestedPosition.x][suggestedPosition.y + 1].id !== Tile.BARS_DOOR_OPEN
            && dungeon.cells[suggestedPosition.x][suggestedPosition.y + 1].id !== Tile.BARS_TRAP_SPRUNG
            && dungeon.monsterAt(suggestedPosition.x, suggestedPosition.y + 1) === undefined) {
            return {
                x: suggestedPosition.x,
                y: suggestedPosition.y + 1
            };
        }
    }

    // If we can't move anywhere, just return the starting position
    return {
        x: sx,
        y: sy
    };
};

// Returns whether point A (sx, sy) is adjecent to point B (dx, dy)
Monster.prototype.pointIsAdjecent = function(x1, y1, x2, y2) {
    'use strict';

    if((Math.abs(x1 - x2) === 1 || Math.abs(x1 - x2) === 0)
        && (Math.abs(y1 - y2) === 1 || Math.abs(y1 - y2) === 0)) {
        return true;
    }

    return false;
};