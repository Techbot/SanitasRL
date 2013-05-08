/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
var Player = function(x, y) {
    'use strict';

    this.x = x;
    this.y = y;

    this.health = 40;
    this.armour = new Item(undefined, undefined, Items.fur_armour);
    this.weapon = new Item(undefined, undefined, Items.club);
    this.jewelry = new Item(undefined, undefined, Items.necklace_of_luck);

    // what last hit the player, used to display on the death screen
    this.lastHit = undefined;
    this.lastHitPro = undefined;

    this.updateInterface();
};

Player.prototype.calcDamage = function() {
    'use strict';
    
    if(this.health >= 40) {
        return this.weapon.effect + 0.5;
    }
                                // Reverse HP, 40 = 1, 1 = 40
    return this.weapon.effect + ((21 + (20 - this.health)) / 2);
};

Player.prototype.calcDefence = function() {
    'use strict';

    return this.armour.effect;
};

Player.prototype.hit = function() {
    'use strict';

    if(this.weapon.id === 'warplauge') {
        return 100;
    }

    if(this.health >= 40) {
        return 30;
    }

    if(Math.round(Math.sqrt(21 + (20 - this.health)) * 30) > 100) {
        return 100;
    }

    return Math.round(Math.sqrt(21 + (20 - this.health)) * 30);
};

Player.prototype.updateInterface = function() {
    'use strict';

    $('.character-health').text(this.health);
    $('.character-damage').text(this.calcDamage() + ' (' + this.hit() + '%)');
    $('.character-defence').text(this.calcDefence());

    $('.character-weapon').text(this.weapon.name);
};