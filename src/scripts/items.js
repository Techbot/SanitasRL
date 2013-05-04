/*
 * SanitasRL - 7DRL2013
 * Developer: codejunkie
 * URL: http://codejunkie.se/sanitasrl/
 */
var Item = function(x, y, item) {
    'use strict';

    this.x = x;
    this.y = y;

    this.id = item.id;
    this.type = item.type;
    this.prefix = item.prefix;
    this.name = item.name;
    this.description = item.description;
    this.flavour = item.flavour;
    this.level = item.level;
    this.effect = item.effect;
    this.image = item.image;
};

Item.prototype.displayName = function() {
    'use strict';

    if(this.prefix === '') {
        return this.name;
    }

    return this.prefix + ' ' + this.name;
};

Item.type = {
    armour: 0,
    weapon: 1,
    jewelry: 2
};

var Items = {
    // Equipment - Armour
    fur_armour: {
        id: 'fur_armour',
        type: Item.type.armour,
        prefix: 'Some',
        name: 'Fur Armour',
        description: '',
        flavour: '',
        level: 0,
        effect: 0,
        image: {
            x: 0,
            y: 0
        }
    },
    leather_armour: {
        id: 'leather_armour',
        type: Item.type.armour,
        prefix: 'A',
        name: 'Leather Cuirass',
        description: '',
        flavour: '',
        level: 1,
        effect: 1,
        image: {
            x: 0,
            y: 0
        }
    },
    studded_leather_armour: {
        id: 'studded_leather_armour',
        type: Item.type.armour,
        prefix: 'A',
        name: 'Studded Leather Cuirass',
        description: '',
        flavour: '',
        level: 1,
        effect: 2,
        image: {
            x: 0,
            y: 0
        }
    },
    ringmail: {
        id: 'ringmail',
        type: Item.type.armour,
        prefix: 'A',
        name: 'Ringmail',
        description: '',
        flavour: '',
        level: 2,
        effect: 3,
        image: {
            x: 0,
            y: 0
        }
    },
    chainmail: {
        id: 'chainmail',
        type: Item.type.armour,
        prefix: 'A',
        name: 'Chainmail',
        description: '',
        flavour: '',
        level: 2,
        effect: 4,
        image: {
            x: 0,
            y: 0
        }
    },
    scalemail: {
        id: 'scalemail',
        type: Item.type.armour,
        prefix: 'A',
        name: 'Scalemail',
        description: '',
        flavour: '',
        level: 3,
        effect: 5,
        image: {
            x: 0,
            y: 0
        }
    },
    splintmail: {
        id: 'splintmail',
        type: Item.type.armour,
        prefix: 'A',
        name: 'Splintmail',
        description: '',
        flavour: '',
        level: 3,
        effect: 6,
        image: {
            x: 0,
            y: 0
        }
    },
    light_platemail: {
        id: 'light_platemail',
        type: Item.type.armour,
        prefix: 'A',
        name: 'Light Platemail',
        description: '',
        flavour: '',
        level: 4,
        effect: 7,
        image: {
            x: 0,
            y: 0
        }
    },
    heavy_platemail: {
        id: 'heavy_platemail',
        type: Item.type.armour,
        prefix: 'A',
        name: 'Heavy Platemail',
        description: '',
        flavour: '',
        level: 5,
        effect: 8,
        image: {
            x: 0,
            y: 0
        }
    },
    rogues_hide: {
        id: 'rogues_hide',
        type: Item.type.armour,
        prefix: 'The',
        name: 'Rogue\'s Hide',
        description: 'A leather cuirass allowing you to see certain traps.',
        flavour: '"@ never seemed troubled by the spikes or the blinding clouds."',
        level: 6,
        effect: 3.5,
        image: {
            x: 0,
            y: 1
        }
    },
    aaidrics_defence: {
        id: 'aaidrics_defence',
        type: Item.type.armour,
        prefix: '',
        name: 'Aaidric\'s Defence',
        description: 'A platemail protecting you from certain traps.',
        flavour: '"The clumsy king Aaidric somehow always walked right into his own traps."',
        level: 6,
        effect: 6,
        image: {
            x: 0,
            y: 1
        }
    },
    icyveins: {
        id: 'icyveins',
        type: Item.type.armour,
        prefix: '',
        name: 'Icy Veins',
        description: 'An enchanted leather cuirass raising your awareness of certain traps.',
        flavour: '"The keep gardener always had to take care of the barmaid Lisa\'s small cat."',
        level: 6,
        effect: 4.5,
        image: {
            x: 0,
            y: 1
        }
    },
    // Equipment - Jewelry
    necklace_of_luck: {
        id: 'necklace_of_luck',
        type: Item.type.jewelry,
        prefix: 'A',
        name: 'Necklace of luck',
        description: '',
        flavour: '"You\'ll need it"',
        level: 0,
        image: {
            x: 2,
            y: 0
        }
    },
    amulet_of_detection: {
        id: 'amulet_of_detection',
        type: Item.type.jewelry,
        prefix: 'The',
        name: 'Amulet of Detection',
        description: 'An amulet that glows whenever enemies are near.',
        flavour: '"Shopkeeper Adrian always scouted the deep tunnels, without any knowledge of fighting."',
        level: 6,
        image: {
            x: 2,
            y: 1
        }
    },
    fargoths_ring: {
        id: 'fargoths_ring',
        type: Item.type.jewelry,
        prefix: '',
        name: 'Fargoth\'s Ring',
        description: 'A ring that fortifies your health by two points.',
        flavour: '"Did you really think he wouldn\'t loose it again?"',
        level: 6,
        image: {
            x: 2,
            y: 1
        }
    },
    // Equipment - Weapons
    axe: {
        id: 'axe',
        type: Item.type.weapon,
        prefix: 'An',
        name: 'Axe',
        description: '',
        flavour: '',
        level: 0,
        effect: 1.5,
        image: {
            x: 1,
            y: 0
        }
    },
    heavy_axe: {
        id: 'heavy_axe',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Heavy Axe',
        description: '',
        flavour: '',
        level: 2,
        effect: 2,
        image: {
            x: 1,
            y: 0
        }
    },
    double_sided_axe: {
        id: 'double_sided_axe',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Double Sided Axe',
        description: '',
        flavour: '',
        level: 3,
        effect: 2.5,
        image: {
            x: 1,
            y: 0
        }
    },
    war_axe: {
        id: 'war_axe',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'War Axe',
        description: '',
        flavour: '',
        level: 4,
        effect: 3,
        image: {
            x: 1,
            y: 0
        }
    },
    battle_axe: {
        id: 'battle_axe',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Battle Axe',
        description: '',
        flavour: '',
        level: 5,
        effect: 3.5,
        image: {
            x: 1,
            y: 0
        }
    },
    club: {
        id: 'club',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Club',
        description: '',
        flavour: '',
        level: 0,
        effect: 1,
        image: {
            x: 1,
            y: 0
        }
    },
    spiked_club: {
        id: 'spiked_club',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Spiked Club',
        description: '',
        flavour: '',
        level: 1,
        effect: 1.5,
        image: {
            x: 1,
            y: 0
        }
    },
    mace: {
        id: 'mace',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Mace',
        description: '',
        flavour: '',
        level: 2,
        effect: 2,
        image: {
            x: 1,
            y: 0
        }
    },
    morning_star: {
        id: 'morning_star',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Morning Star',
        description: '',
        flavour: '',
        level: 3,
        effect: 2.5,
        image: {
            x: 1,
            y: 0
        }
    },
    flail: {
        id: 'flail',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Flail',
        description: '',
        flavour: '',
        level: 4,
        effect: 3,
        image: {
            x: 1,
            y: 0
        }
    },
    warhammer: {
        id: 'warhammer',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Warhammer',
        description: '',
        flavour: '',
        level: 5,
        effect: 3.5,
        image: {
            x: 1,
            y: 0
        }
    },
    dagger: {
        id: 'dagger',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Dagger',
        description: '',
        flavour: '',
        level: 1,
        effect: 1.5,
        image: {
            x: 1,
            y: 0
        }
    },
    shortsword: {
        id: 'shortsword',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Shortsword',
        description: '',
        flavour: '',
        level: 2,
        effect: 2,
        image: {
            x: 1,
            y: 0
        }
    },
    broadsword: {
        id: 'broadsword',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Broadsword',
        description: '',
        flavour: '',
        level: 3,
        effect: 2.5,
        image: {
            x: 1,
            y: 0
        }
    },
    longsword: {
        id: 'longsword',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Longsword',
        description: '',
        flavour: '',
        level: 4,
        effect: 3,
        image: {
            x: 1,
            y: 0
        }
    },
    claymore: {
        id: 'claymore',
        type: Item.type.weapon,
        prefix: 'A',
        name: 'Claymore',
        description: '',
        flavour: '',
        level: 5,
        effect: 3.5,
        image: {
            x: 1,
            y: 0
        }
    },
    cloudcleaver: {
        id: 'cloudcleaver',
        type: Item.type.weapon,
        prefix: '',
        name: 'Cloudcleaver',
        description: 'A staff with the ability of telekinesis.',
        flavour: '"Flying objects was nothing that surprised the archmage."',
        level: 6,
        effect: 1.5,
        image: {
            x: 1,
            y: 1
        }
    },
    warplauge: {
        id: 'warplauge',
        type: Item.type.weapon,
        prefix: 'The',
        name: 'Warplauge',
        description: 'A large hammer somehow always hitting the target.',
        flavour: '"Even the smith\'s son Thomas once squashed a spider with this."',
        level: 6,
        effect: 3,
        image: {
            x: 1,
            y: 1
        }
    },
    // Returns a random item of a specified type and level
    random: function(type, level) {
        'use strict';

        if(level > 5 && level !== 6) {
            level = 5;
        }

        var items = [],
            item,
            prop;

        for(prop in this) {
            if(this.hasOwnProperty(prop) && prop !== 'random') {
                items.push(prop);
            }
        }

        item = this[items[Math.adjustedRandom(0, items.length - 1)]];
        if(type !== undefined && level !== undefined) {
            while(item.type !== type || item.level !== level) {
                item = this[items[Math.adjustedRandom(0, items.length - 1)]];
            }
        } else if(type !== undefined) {
            while(item.type !== type) {
                item = this[items[Math.adjustedRandom(0, items.length - 1)]];
            }
        } else if(level !== undefined) {
            while(item.level !== level) {
                item = this[items[Math.adjustedRandom(0, items.length - 1)]];
            }
        }

        return item;
    }
};