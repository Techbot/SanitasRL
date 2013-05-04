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

    if(this.weapon.description !== '') {
        if($('#character .weapon span.description').length === 0) {
            $('#character .weapon span.name').after('<span class="description" />');
        }

        $('#character .weapon span.description').text(this.weapon.description);
    } else {
        $('#character .weapon span.description').remove();
    }

    if(this.weapon.flavour !== '') {
        if($('#character .weapon span.flavour').length === 0) {
            $('#character .weapon').append('<span class="flavour" />');
        }

        $('#character .weapon span.flavour').text(this.weapon.flavour);
    } else {
        $('#character .weapon span.flavour').remove();
    }

    $('.character-armour').text(this.armour.name);

    if(this.armour.description !== '') {
        if($('#character .armour span.description').length === 0) {
            $('#character .armour span.name').after('<span class="description" />');
        }

        $('#character .armour span.description').text(this.armour.description);
    } else {
        $('#character .armour span.description').remove();
    }

    if(this.armour.flavour !== '') {
        if($('#character .armour span.flavour').length === 0) {
            $('#character .armour').append('<span class="flavour" />');
        }

        $('#character .armour span.flavour').text(this.armour.flavour);
    } else {
        $('#character .armour span.flavour').remove();
    }

    $('.character-trinket').text(this.jewelry.name);

    if(this.jewelry.description !== '') {
        if($('#character .jewelry span.description').length === 0) {
            $('#character .jewelry span.name').after('<span class="description" />');
        }

        $('#character .jewelry span.description').text(this.jewelry.description);
    } else {
        $('#character .jewelry span.description').remove();
    }

    if(this.jewelry.flavour !== '') {
        if($('#character .jewelry span.flavour').length === 0) {
            $('#character .jewelry').append('<span class="flavour" />');
        }

        $('#character .jewelry span.flavour').text(this.jewelry.flavour);
    } else {
        $('#character .jewelry span.flavour').remove();
    }
};