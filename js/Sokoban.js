(function() {
    var canvas = document.getElementById('sokoban');
    if(!canvas)
    {
        throw Error("Impossible de récupérer le canvas");
    }

    var context = canvas.getContext('2d');
    if(!context)
    {
        throw Error("Impossible de récupérer le context du canvas");
    }

    var data = {
        size: 34,
        cell: {
            empty: '.',
            goal: '@',
            wall: '#',
            box: '&',
            characterUp: '↑', // alt + 24
            characterDown: '↓', // alt + 25
            characterRight: '→', // alt + 26
            characterLeft: '←' // alt + 27
        },
        images:{
            box: 'images/box.jpg',
            boxOk: 'images/box_ok.jpg',
            characterUp: 'images/mario_up.gif',
            characterDown: 'images/mario_down.gif',
            characterLeft: 'images/mario_left.gif',
            characterRight: 'images/mario_right.gif',
            goal: 'images/goal.png',
            wall: 'images/wall.jpg'
        },
        levels: [
            [
                '#####..#####',
                '#####↓.....#',
                '####...##..#',
                '.@@#.#.##.##',
                '.....&..#&##',
                '#..#.#....##',
                '####...##&##',
                '#########..#',
                '####@......#',
                '############'
            ],
            [
                '############',
                '###..@@#####',
                '###..&&#####',
                '###..↑.#####',
                '############'
            ],
            [
                '############',
                '#####↓.#####',
                '#####&&#####',
                '#####@@#####',
                '############'
            ]
        ].map(function(array){
          return array.map(function(items){
              return items.split('');
          });
        })
    };

    // load images

    (function(){
        var c = 0;
        var keys = Object.keys(data.images);
        keys.forEach(function(key){
            var image = new Image();
            image.src = data.images[key];
            image.onload = function(){
                data.images[key] = image;
                if(++c == keys.length){
                    init();
                }
            }
        });
    })();

    // variables declaration

    var level = data.levels[0];
    var map;
    var character;

    /**
     * Initialization of game
     */
    function init(){
        reset();
        document.addEventListener('keydown',function(e){
            switch (e.keyCode) {
                case 37: move('left'); break;
                case 38: move('up'); break;
                case 39: move('right'); break;
                case 40: move('down'); break;
            }
        });
        document.getElementById('btnRestart').addEventListener('click',function(){ reset(); });
        document.getElementById('selectLevel').addEventListener('change',function(){ changeLevel(this.value) });
    }

    /**
     * Reset the game
     */
    function reset(){
        map = clone(level);
        draw();
    }

    /**
     * Change the level
     * @param {number} iLevel
     */
    function changeLevel(iLevel){
        if(iLevel > -1 && iLevel < data.levels.length){
            level = data.levels[iLevel];
            reset();
        } else {
            throw new Error('Level must be bigger than 0 and leather than length of levels');
        }
    }

    /**
     * Clone an object
     *  @param {any} any 
     */
    function clone(any){
        return JSON.parse(JSON.stringify(any));
    }

    /**
     * Draw the game with a canvas
     */
    function draw() {
        clearGame();
        canvas.width = data.size * map[0].length;
        canvas.height = data.size * map.length;
        for(var y =0; y < map.length;y++) {
            for (var x = 0; x < map[y].length; x++) {
                if(isCharacterCell(x,y)){
                    character = { x: x, y: y };
                }
                drawCell(x,y,map[y][x]);
            }
        }
    }

    /**
     * Draw a cell with state specified
     * @param {number} x
     * @param {number} y
     * @param {string} state box, character up, character down, character left, goal, box, boxOk or wall
     */
    function drawCell(x,y,state) {
        var image;
        switch(state){
            case data.cell.box: image = data.images.box; break;
            case data.cell.characterUp: image = data.images.characterUp; break;
            case data.cell.characterRight: image = data.images.characterRight; break;
            case data.cell.characterDown: image = data.images.characterDown; break;
            case data.cell.characterLeft: image = data.images.characterLeft; break;
            case data.cell.goal: image = data.images.goal; break;
            case data.cell.boxOk : image = data.images.boxOk; break;
            case data.cell.wall : image = data.images.wall; break;
            default: return;
        }
        context.drawImage(image,x*data.size,y*data.size,data.size,data.size);
    }

    function clearGame(){
        context.clearRect(0,0, 420, 420);
    }

    /**
     * Clear a cell if is not a wall
     * @param {number} x
     * @param {number} y
     */
    function clearCell(x,y){
        if(!isWallCell(x,y)) context.clearRect(x * data.size, y * data.size, data.size, data.size);
    }

    /**
     * Check if the cell is {type}
     * @param {number} x
     * @param {number} y
     * @param {string} type
     * @returns {boolean}
     */
    function isCell(x,y,type){
        return map[y][x] == type;
    }

    /**
     * Check if the cell is a wall
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isWallCell(x,y){
        return isCell(x,y,data.cell.wall);
    }

    /**
     * Check if the cell is empty
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isEmptyCell(x,y){
        return isCell(x,y,data.cell.empty);
    }

    /**
     * Check if the cell is a box
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isBoxCell(x,y) {
        return isCell(x,y,data.cell.box) || isCell(x,y,data.cell.boxOk);
    }

    /**
     * Check if the cell is goal
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isGoalCell(x,y){
        return isCell(x,y,data.cell.goal);
    }

    /**
     * Check if the cell is a character up
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isCharacterUpCell(x,y){
        return isCell(x,y,data.cell.characterUp);
    }

    /**
     * Check if the cell is a character right
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isCharacterRightCell(x,y){
        return isCell(x,y,data.cell.characterRight);
    }

    /**
     * Check if the cell is a character down
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isCharacterDownCell(x,y){
        return isCell(x,y,data.cell.characterDown);
    }

    /**
     * Check if the cell is a character left
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isCharacterLeftCell(x,y){
        return isCell(x,y,data.cell.characterLeft);
    }

    /**
     * Check if the cell is a character
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isCharacterCell(x,y){
        return isCharacterUpCell(x,y) || isCharacterRightCell(x,y) || isCharacterDownCell(x,y) || isCharacterLeftCell(x,y);
    }

    /**
     * Check if the cell is empty or goal
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    function isGoalOrEmptyCell(x,y) {
      return isGoalCell(x, y) || isEmptyCell(x,y);
    }

    /**
     * Move the character in a direction
     * @param {string} direction up, right, down or left
     */
    function move(direction){
        var state;
        var x = character.x;
        var y = character.y;
        // x1 for move on one column, x2 for move on two columns, y1 for move on one row, y2 for move on two rows
        var x1, x2, y1, y2;

        switch(direction){
            case 'up':
                if(!(character.y > 0)) return;
                x1 = x2 = x;
                y1 = y - 1;
                y2 = y - 2;
                state = data.cell.characterUp;
                break;
            case 'down':
                if(!(character.y < map.length)) return;
                x1 = x2 = x;
                y1 = y + 1;
                y2 = y + 2;
                state = data.cell.characterDown;
                break;
            case 'left':
                if(!(character.x > 0)) return;
                y1 = y2 = y;
                x1 = x - 1;
                x2 = x - 2;
                state = data.cell.characterLeft;
                break;
            case 'right':
                if(!(character.x < map[character.y].length)) return;
                y1 = y2 = y;
                x1 = x + 1;
                x2 = x + 2;
                state = data.cell.characterRight;
                break;
            default: throw new Error('direction must be up, down, left or right');
        }

        if(isGoalOrEmptyCell(x1,y1) || ( isBoxCell(x1,y1) && isGoalOrEmptyCell(x2,y2) )){
            if(isBoxCell(x1,y1)){
                var type = isGoalCell(x2,y2) ? data.cell.boxOk : data.cell.box;
                clearCell(x1,y1);
                drawCell(x2,y2,type);
                map[y2][x2] = type;
            }
            clearCell(x,y);
            drawCell(x1,y1,state);
            if(level[y][x] == data.cell.goal){
                drawCell(x,y,data.cell.goal);
                map[y][x] = data.cell.goal;
            }else{
                map[y][x]= data.cell.empty;
            }
            map[y1][x1] = state;
            character.y = y1;
            character.x = x1;
        }
        if(isFinished()){
            // timeout for wait to display the box ok
            setTimeout(function(){
                alert('You are the winner !');
                reset();
            },100);
        }
    }

    /**
     * Check if the party is finished (If no goal cell is displayed)
     * @returns {boolean}
     */
    function isFinished(){
        for(var y =0; y<map.length;y++)
            for (var x = 0; x < map[y].length; x++)
                if(level[y][x] == data.cell.goal && !isBoxCell(x,y))
                    return false;
        return true;
    }
})();