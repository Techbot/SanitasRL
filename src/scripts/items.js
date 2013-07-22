var Item = {
    COCA_LEAF: {
        id: 0,
        name: 'Coca Leaf',
        use: function(game) {
        }
    },
    OPIUM_POPPY: {
        id: 1,
        name: 'Opium Poppy',
        use: function(game, item) {
            game.player.health += 2;
            item.quantity -= 1;
        }
    }
};
