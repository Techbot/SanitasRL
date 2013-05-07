/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
var Monster = function(x, y, monster) {
    'use strict';

    this.x = x;
    this.y = y;

    this.prefix = monster.prefix;
    this.name = monster.name;
    this.health = monster.health;
    this.armour = (monster.humanoid === true) ? new Item(undefined, undefined, Items.random(Item.type.armour, monster.level)) : undefined;
    this.weapon = (monster.humanoid === true) ? new Item(undefined, undefined, Items.random(Item.type.weapon, monster.level)) : undefined;
    this.damage = monster.damage;
    this.defence = monster.defence;
    this.hit = monster.hit;
    this.level = monster.level;
    this.color = monster.color;
    this.image = monster.image;

    // This will be updated for all creatures within the players FOV
    // Always pursuit this point in turn
    // If the creature is not inside the players FOV when it has reached
    // this position, set it to undefined and the creature will
    // stop pursuing the player
    this.lastKnownPositionOfPlayer = undefined;
    
    // The following variables are only used by the dragon
    this.chargingFireball = false;
    this.startTurn = 0;
    this.chargingBegan = 0;
    this.fireballPosition = {
        x: 0,
        y: 0
    };
};

Monster.prototype.displayName = function() {
    'use strict';

    var name;
    if(this.prefix === '') {
        name = this.name;
    } else {
        name = this.prefix + ' ' + this.name;
    }

    if(this.armour !== undefined && this.weapon !== undefined) {
        name += ' wearing ' + this.armour.prefix.toLowerCase() + ' ' + this.armour.name + ' and wielding ' + this.weapon.prefix.toLowerCase() + ' ' + this.weapon.name + ' with ' + this.health + ' health left.';
    }

    return name;
};

Monster.prototype.calcDefence = function() {
    'use strict';

    if(this.armour !== undefined) {
        return this.defence + this.armour.effect;
    }
    return this.defence;
};

Monster.prototype.calcDamage = function() {
    'use strict';

    if(this.weapon !== undefined) {
        return this.damage + this.weapon.effect;
    }

    return this.damage;
};

Monster.prototype.turn = function(player, dungeon, turn) {
    'use strict';
    
    if(this.health > 0) {

        var dmg, newPosition;
        if(this.name !== 'Dragon') {
            // if we're at the last known position of the player, stop moving
            if(this.x === this.lastKnownPositionOfPlayer.x
                && this.y === this.lastKnownPositionOfPlayer.y) {
                this.lastKnownPositionOfPlayer = undefined;
            }

            if(this.pointIsAdjecent(this.x, this.y, player.x, player.y) === true) {

                // check if we can hit the player
                if(ROT.RNG.getRangeUniform(0, 100) > this.hit + (5 * player.calcDefence())) {
                    // TODO: Notify user about the monster missing you
                } else {
                    dmg = Math.max(0.25, this.calcDamage() - player.calcDefence());

                    if(dmg > 0) {
                        player.health -= dmg;
                        player.lastHitPro = 'to';
                        player.lastHit = this.prefix.toLowerCase() + ' ' + this.name;
                        
                        // TODO: Notify user about the monster dealing damage to you
                        player.updateInterface();
                    } else {
                        // TODO: Notify user about the monster not dealing damage to you
                    }
                }

            // if we're not adjacent to the player, move towards the player
            } else {
                newPosition = this.pathfind(this.x, this.y, player.x, player.y, dungeon);

                this.x = newPosition.x;
                this.y = newPosition.y;
            }
        // DRAGON AI
        } else {
            if(this.chargingFireball === false) {
            
                // we should charge a fireball (every 7th turn)
                if((turn - this.startTurn) % 7 === 0) {
                    // TODO: Notify user about the dragon charging a fireball
                    this.chargingFireball = true;
                    this.chargingBegan = turn;
                    this.fireballPosition = {
                        x: player.x,
                        y: player.y
                    };
                } else {
            
                    // if we're at the last known position of the player, stop moving
                    if(this.x === this.lastKnownPositionOfPlayer.x
                        && this.y === this.lastKnownPositionOfPlayer.y) {
                        this.lastKnownPositionOfPlayer = undefined;
                    }

                    if(this.pointIsAdjecent(this.x, this.y, player.x, player.y) === true) {

                        // check if we can hit the player
                        if(ROT.RNG.getRangeUniform(0, 100) > this.hit + (5 * player.calcDefence())) {
                            // TODO: Notify user about the dragon missing you
                        } else {
                            dmg = Math.max(0.25, this.calcDamage() - player.calcDefence());

                            if(dmg > 0) {
                                player.health -= dmg;
                                player.lastHitPro = 'to';
                                player.lastHit = this.prefix.toLowerCase() + ' ' + this.name;
                                // TODO: Notify user about the dragon dealing damage to you
                                player.updateInterface();
                            } else {
                                // TODO: Notify user about the dragon not dealing damage to you
                            }
                        }

                    // if we're not adjacent to the player, move towards the player
                    } else {
                        newPosition = this.pathfind(this.x, this.y, player.x, player.y, dungeon);

                        this.x = newPosition.x;
                        this.y = newPosition.y;
                    }
                
                }
            
            // Charging fireball (takes 2 turns)
            } else {
                if(turn - this.chargingBegan === 2) {
                    this.chargingFireball = false;
                    // TODO: Notify user about the dragon firing a fireball
                    
                    /*if(dungeon.cells[this.fireballPosition.x][this.fireballPosition.y].id !== Tile.BOSS_HALLWAY.id) {
                        dungeon.cells[this.fireballPosition.x][this.fireballPosition.y] = Tile.FIREBALL;
                    }*/
                    
                    if(player.x === this.fireballPosition.x && player.y === this.fireballPosition.y) {
                        player.health -= 2;
                        player.lastHitPro = 'by getting hit by';
                        player.lastHit = 'a fireball';
                        player.updateInterface();
                        // TODO: Notify user about you taking damage from the fireball
                    }
                }
            }
        }
        
    }
};

var Monsters = {
    // Dungeon Level 1
    bat: {
        prefix: 'A',
        name: 'Bat',
        level: 1,
        health: 3,
        defence: 1,
        damage: 0.5,
        hit: 35,
        humanoid: false,
        image: {
            x: 0,
            y: 0
        }
    },
    snake: {
        prefix: 'A',
        name: 'Snake',
        level: 1,
        health: 5,
        defence: 1,
        damage: 1.5,
        hit: 30,
        humanoid: false,
        image: {
            x: 1,
            y: 0
        }
    },
    hound: {
        prefix: 'A',
        name: 'Hound',
        level: 1,
        health: 3,
        defence: 1,
        damage: 2.5,
        hit: 25,
        humanoid: false,
        image: {
            x: 2,
            y: 0
        }
    },
    // Dungeon Level 2
    goblin: {
        prefix: 'A',
        name: 'Goblin',
        level: 2,
        health: 5,
        defence: 0,
        damage: 0.5,
        hit: 40,
        humanoid: true,
        image: {
            x: 0,
            y: 1
        }
    },
    kobold: {
        prefix: 'A',
        name: 'Kobold',
        level: 2,
        health: 7,
        defence: 0,
        damage: 1.5,
        hit: 35,
        humanoid: true,
        image: {
            x: 1,
            y: 1
        }
    },
    gnoll: {
        prefix: 'A',
        name: 'Gnoll',
        level: 2,
        health: 5,
        defence: 0,
        damage: 2.5,
        hit: 30,
        humanoid: true,
        image: {
            x: 2,
            y: 1
        }
    },
    // Dungeon Level 3
    skellington: {
        prefix: 'A',
        name: 'Skellington',
        level: 3,
        health: 10,
        defence: 0,
        damage: 1.5,
        hit: 40,
        humanoid: true,
        image: {
            x: 0,
            y: 2
        }
    },
    zombie: {
        prefix: 'A',
        name: 'Zombie',
        level: 3,
        health: 20,
        defence: 2,
        damage: 5.5,
        hit: 35,
        humanoid: false,
        image: {
            x: 1,
            y: 2
        }
    },
    troll: {
        prefix: 'A',
        name: 'Troll',
        level: 3,
        health: 15,
        defence: 2,
        damage: 6.5,
        hit: 30,
        humanoid: false,
        image: {
            x: 2,
            y: 2
        }
    },
    // Dungeon Level 4
    orc: {
        prefix: 'An',
        name: 'Orc',
        level: 4,
        health: 25,
        defence: 0,
        damage: 3.5,
        hit: 15,
        humanoid: true,
        image: {
            x: 0,
            y: 3
        }
    },
    hobgoblin: {
        prefix: 'A',
        name: 'Hobhoblin',
        level: 4,
        health: 25,
        defence: 0,
        damage: 4.5,
        hit: 15,
        humanoid: true,
        image: {
            x: 1,
            y: 3
        }
    },
    wraith: {
        prefix: 'A',
        name: 'Wraith',
        level: 4,
        health: 30,
        defence: 2,
        damage: 5.5,
        hit: 30,
        humanoid: false,
        image: {
            x: 2,
            y: 3
        }
    },
    // Dungeon Level 5
    lich: {
        prefix: 'A',
        name: 'Lich',
        level: 5,
        health: 30,
        defence: 4,
        damage: 6.5,
        hit: 15,
        humanoid: false,
        image: {
            x: 0,
            y: 4
        }
    },
    bonelord: {
        prefix: 'A',
        name: 'Bonelord',
        level: 5,
        health: 35,
        defence: 5,
        damage: 7,
        hit: 15,
        humanoid: false,
        image: {
            x: 1,
            y: 4
        }
    },
    // Dungeon Level 5 (6) - Boss
    dragon: {
        prefix: 'The',
        name: 'Dragon',
        level: 6,
        health: 100,
        defence: 5,
        damage: 9,
        hit: 70,
        humanoid: false,
        image: {
            x: 2,
            y: 4
        }
    },
    // Returns a random monster of a specified level
    random: function(level) {
        'use strict';

        var monsters = [],
            monster,
            prop;

        for(prop in this) {
            if(this.hasOwnProperty(prop) && prop !== 'random') {
                monsters.push(prop);
            }
        }

        monster = this[monsters[ROT.RNG.getRangeUniform(0, monsters.length - 1)]];
        if(level !== undefined) {
            while(monster.level !== level) {
                monster = this[monsters[ROT.RNG.getRangeUniform(0, monsters.length - 1)]];
            }
        }

        return monster;
    }
};