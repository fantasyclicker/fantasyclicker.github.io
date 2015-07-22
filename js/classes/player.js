(function(root) {
    function Player() {
        // Приватные переменные
        var maxHP = 10,
            HP = maxHP,
            damage = 1,
            gold = 1,
            coordX = 0,
            coordY = 0,
            cssClass = 'player';

        // Объект
        return {
            getHP: function() {
                return HP;
            },
            getMaxHP: function() {
                return maxHP;
            },
            getDamage: function() {
                return damage;
            },
            getGold: function() {
                return gold;
            },
            addGold: function(value) {
                gold += Number(value);
            },
            getCssClass: function() {
                return cssClass;
            },
            getCoords: function() {
                return {
                    x: coordX,
                    y: coordY
                }
            },
            setCoords: function(x, y) {
                coordX = x;
                coordY = y;
            },
            hurt: function(value) {
                HP -= Number(value);
            },
            buyDamage: function() {
                var DAMAGE_COST = 10;
                var DAMAGE_INCREASE_VALUE = 1;

                if (gold >= DAMAGE_COST) {
                    damage += DAMAGE_INCREASE_VALUE;
                    gold -= DAMAGE_COST;
                    return true;
                }
                return false;
            },
            buySword: function() {
                var COST = 120;
                var DAMAGE_INCREASE_VALUE = 20;

                if (gold >= COST) {
                    damage += DAMAGE_INCREASE_VALUE;
                    gold -= COST;
                    return true;
                }
                return false;
            },
            buyGlass: function() {
                var COST = 2000;

                if (gold >= COST) {
                    gold -= COST;
                    return true;
                }
                return false;
            }
        }
    }

    // Экспортируем класс игрока
    root.Player = Player;
})(window);