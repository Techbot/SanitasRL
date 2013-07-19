var Inventory = function() {
    'use strict';

    this.items = [];
};

Inventory.prototype.add = function(item, quantity) {
    for(var i = 0; i < this.items.length; i++) {
        if(this.items[i].id === item.id) {
            this.items[i].quantity += quantity;
            return;
        }
    }

    this.items.push($.extend(item, { quantity: quantity }));
};
