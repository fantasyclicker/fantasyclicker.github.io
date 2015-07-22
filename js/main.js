(function() {
    var jsMap = document.querySelector('.jsMap'),
        jsHint = document.querySelector('.jsHint'),
        jsDamage = document.querySelector('.jsDamage'),
        jsMonsterHP = document.querySelector('.jsMonsterHP'),
        jsGold = document.querySelector('.jsGold'),
        jsBuySword = document.querySelector('.jsBuySword'),
        jsBuyClick = document.querySelector('.jsBuyClick'),
        jsUpgradeClick = document.querySelector('.jsUpgradeClick'),
        jsBuyGlassess = document.querySelector('.jsBuyGlassess'),
        player = new Player(),
    //todo: переделать player
        //player = {
        //    HP: 20,
        //    damage: 1,
        //    gold: 0
        //},
        map,
        CELL_SIZE = 61,
        MAP_SIZE = {
            width: 100,
            height: 100
        },
        screenSize = {
            width: 5,
            height: 5
        },
        currentScreenCoords = {
            top: 0,
            left: 0
        },
        monsters = [],
        beastiary = {},
        beastiaryAssoc = [];

// field types:
// 0 - grass
// 1 - forest
// 2 - water
    map = [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 2, 1, 1, 1, 1, 1, 0, 0, 1],
        [0, 2, 0, 1, 1, 1, 1, 0, 1, 1],
        [0, 2, 0, 0, 0, 0, 1, 0, 0, 1],
        [0, 2, 0, 0, 0, 0, 1, 1, 0, 1],
        [0, 2, 0, 0, 0, 0, 1, 1, 0, 1],
        [0, 2, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
        [0, 2, 2, 2, 0, 0, 1, 1, 1, 1]
    ];
    beastiary['M'] = {
        name: 'Максимка',
        type: 'M',
        HP: 10,
        damage: 1,
        gold: 10
    };
    beastiary['B'] = {
        name: 'Зверь',
        type: 'B',
        HP: 20,
        damage: 2,
        gold: 25
    };
    for (var i in beastiary) {
        if (beastiary.hasOwnProperty(i)) {
            beastiaryAssoc.push(i);
        }
    }

    function generateMap() {
        //
    }

    function clone(obj) {
        var newObj = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                newObj[i] = obj[i];
            }
        }
        return newObj;
    }

    function isMonster(x, y) {
        return monsters[y] && monsters[y][x] instanceof Object && monsters[y][x].type;
    }
    function checkMonsters() {
        var count = 0;
        for (var j=0; j < monsters.length; j++) {
            if (monsters[j]) {
                for (var i=0; i < monsters[j].length; i++) {
                    if (monsters[j][i] instanceof Object) {
                        if (monsters[j][i].HP <= 0) {
                            player.addGold(Math.round(Math.random()*monsters[j][i].gold));
                            jsGold.innerText = player.getGold();
                            monsters[j][i] = undefined;
                        } else {
                            count++;
                        }
                    }
                }
            }
        }
        return count;
    }
    function createMonster() {
        var x = 0, y = 0;
        do {
            x = Math.round(Math.random()*(map[0].length-1));
            y = Math.round(Math.random()*(map.length-1));
        } while (map[y][x] !== 0);
        if (!monsters[y]) {
            monsters[y] = [];
        }
        var mType = beastiaryAssoc[Math.round(Math.random()*1)];
        monsters[y][x] = clone(beastiary[mType]);
    }

    function setPlayerCoords() {
        player.setCoords(
            currentScreenCoords.left + Math.floor(screenSize.width/2),
            currentScreenCoords.top + Math.floor(screenSize.height/2)
        );
    }

    function drawMap(map) {
        jsMap.innerHTML = '';

        // пересоздаём монстра, если они закончились
        if (!checkMonsters()) {
            createMonster();
        }

        // вычисляем координаты игрока на экране (это центр экрана)
        for (var y=currentScreenCoords.top, yLen=currentScreenCoords.top+screenSize.height; y < yLen; y++) {
            for (var x=currentScreenCoords.left, xLen=currentScreenCoords.left+screenSize.width; x < xLen; x++) {
                // field
                var field = document.createElement('div'),
                    curCellType = 0;
                if (y < 0 || x < 0 || !map[y] || map[y][x] === undefined) {
                    curCellType = -1;
                } else {
                    curCellType = parseInt(map[y][x]);
                }
                field.className='field field_'+curCellType;
                // player
                if (y === player.getCoords().y && x === player.getCoords().x) {
                    var domPlayer = document.createElement('div');
                    domPlayer.className = player.getCssClass();
                    field.appendChild(domPlayer);
                    field.className += ' field_P';
                    // monster
                } else if (isMonster(x, y)) {
                    var monster = document.createElement('div');
                    monster.className = 'monster monster_'+monsters[y][x].type;
                    field.appendChild(monster);
                    field.className += ' field_M';
                }
                field.setAttribute("data-y", y);
                field.setAttribute("data-x", x);
                field.onmouseover = hint;
                field.onclick = move;
                jsMap.appendChild(field);
            }
            jsMap.appendChild(document.createElement('br'));
        }
    }

    function move() {
        var y = Number(this.getAttribute('data-y'));
        var x = Number(this.getAttribute('data-x'));
        if (
            y === player.getCoords().y && x === player.getCoords().x
        ) {
            var randPhrase = ['Топчимся на месте...', 'Топ-топ-топ...'];
            jsHint.innerHTML = randPhrase[Math.round(Math.random())];
        } else {
            // вычисляем смещение экрана
            var nextScreenCoords = {
                    left: currentScreenCoords.left,
                    top: currentScreenCoords.top
                },
                nextPlayerCoords = {
                    left: 0,
                    top: 0
                };
            if (x-player.getCoords().x) {
                nextScreenCoords.left = currentScreenCoords.left + (x-player.getCoords().x)/Math.abs(x-player.getCoords().x);
            }
            if (y-player.getCoords().y) {
                nextScreenCoords.top = currentScreenCoords.top + (y-player.getCoords().y)/Math.abs(y-player.getCoords().y);
            }
            nextPlayerCoords.left = nextScreenCoords.left + Math.floor(screenSize.width/2);
            nextPlayerCoords.top = nextScreenCoords.top + Math.floor(screenSize.height/2);
            if (nextPlayerCoords.top <= -1 || nextPlayerCoords.left <= -1) {
                jsHint.innerHTML = 'Тут ничего нет!';
            } else if (map[nextPlayerCoords.top][nextPlayerCoords.left] === 1) {
                jsHint.innerHTML = 'Ты не пройдёшь!!';
            } else if (map[nextPlayerCoords.top][nextPlayerCoords.left] === 2) {
                jsHint.innerHTML = 'Тебя в детстве не учили плавать...';
            } else if (isMonster(nextPlayerCoords.left, nextPlayerCoords.top)) {
                var currentMonster = monsters[nextPlayerCoords.top][nextPlayerCoords.left],
                    monsterDamage = Math.round(Math.random()*currentMonster.damage);
                var playerDamage = player.getDamage();
                jsHint.innerHTML = 'Ты отнял у монстра '+currentMonster.name+' '+playerDamage+'. '+currentMonster.name+' отнял у тебя '+monsterDamage;
                player.hurt(monsterDamage);
                currentMonster.HP -= playerDamage;
                jsMonsterHP.innerText = currentMonster.HP+'/'+beastiary[currentMonster.type].HP;
                drawMap(map);
            } else {
                currentScreenCoords.left = nextScreenCoords.left;
                currentScreenCoords.top = nextScreenCoords.top;

                setPlayerCoords();

                drawMap(map);
            }
        }
    }

    function hint() {
        var y = Number(this.getAttribute('data-y'));
        var x = Number(this.getAttribute('data-x'));
        if (y === player.getCoords().y && x === player.getCoords().x) {
            jsHint.innerHTML = 'Это ты родимый';
        } else {
            if (this.className.indexOf('field_M') > -1) {
                jsHint.innerHTML = 'А это вражеский супостат! Вали его!!';
            } else if (this.className.indexOf('field_0') > -1) {
                jsHint.innerHTML = 'Это зеленая травка';
            } else if (this.className.indexOf('field_1') > -1) {
                jsHint.innerHTML = 'Это непроходимый лес';
            } else if (this.className.indexOf('field_2') > -1) {
                jsHint.innerHTML = 'Это быстрая речка';
            }
        }
    }

    jsBuyClick.onclick = function() {
        if (player.buyDamage()) {
            jsDamage.innerText = player.getDamage();
            jsGold.innerText = player.getGold();
        }
        return false;
    };

    jsBuySword.onclick = function() {
        if (player.buySword()) {
            jsDamage.innerText = player.getDamage();
            jsGold.innerText = player.getGold();
            this.style.display = 'none';
        }
        return false;
    };

    jsBuyGlassess.onclick = function() {
        if (player.buyGlass()) {
            jsGold.innerText = player.getGold();

            currentScreenCoords.left -= Math.round((10-screenSize.width)/2);
            currentScreenCoords.top -= Math.round((10-screenSize.height)/2);

            screenSize.width = 10;
            screenSize.height = 10;

            setPlayerCoords();

            drawMap(map);

            this.style.display = 'none';
        }
        return false;
    };


    setPlayerCoords();
    createMonster();
    drawMap(map, player);
})();