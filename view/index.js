/**画棋盘**/
function createMap(x, y){
    var map = document.querySelector("#map");
    if(map){
        document.querySelector("body").removeChild(map);
    }
    map = document.createElement("div");
    map.id = 'map';
    map.style.width = x * 20 + 'px';
    map.style.height = y * 20 + 'px';
    for(var i = 0; i < y; i++){
        for(var n = 0; n < x; n++){
            var block = document.createElement('div');
            block.id = 'block_' + i + '_' + n;
            block.className = "block";
            if(n === (x - 1)){ block.className += ' right';}
            if(n === 0){ block.className += ' left';}
            if(i === (y - 1)){ block.className += ' bottom';}
            if(i === 0){ block.className += ' top';}
            map.appendChild(block);
        }
    }
    main.size.x = x;
    main.size.y = y;
    document.body.appendChild(map);
}


/**基础dom操作**/
function $(el){
    if(el && el.attributes && el.attributes.length >= 0){
        this.ele = el;
    }else if( el ){
        this.ele = document.querySelector( el )
    }
}

$.prototype.on = function( type, fn ){
    if(!this.ele){ console.error('DOM is not find'); return this;}
    if(this.ele.addEventListener){
        this.ele.addEventListener(type, fn );
    }else if(this.ele.attachevent){
        this.ele.attachevent( type, fn );
    }else {
        this.ele[ 'on' + type ] = fn;
    }
    return this;
};

$.prototype.addClass = function( classname ){
    var classList = this.ele.className.split(" ");
    classList.push( classname );
    this.ele.className = classList.join(" ");
    return this;
};

$.prototype.removeClass = function( classname ){
    var classList = this.ele.className.split(" ");
    var index = classList.indexOf( classname );
    if(index === -1){ return this; }
    classList.splice( index, 1 );
    this.ele.className = classList.join(" ");
    return this;
};

$.prototype.val = function( value ){
    if( value ){ this.ele.value = value; return this; } 
    return this.ele.value;
};

$.prototype.getEvent = function( event ){
    return event ? event : window.event;
};

$.prototype.hasClass = function( classname ){
    var classList = this.ele.className.split(" ");
    var index = classList.indexOf( classname );
    if(index === -1){ return false; }else{ return true; }
};

$.prototype.entrust = function( ele, fn ){
    var self = this;
    this.on("click", function( e ){
        var event = self.getEvent( e );
        var target = new $(event.target || event.scrElement);
        if( target.hasClass( ele ) ){
            fn(event , target);
        }
        event.stopPropagation();
    });
};

$.prototype.toDom = function(){
    return this.ele;
};

$.prototype.off = function( type, fn){
    if(!this.ele){ console.error('DOM is not find'); return this;}
    if(this.ele.removeEventListener){
        this.ele.removeEventListener(type, fn );
    }else if(this.ele.datachevent){
        this.ele.datachevent( type, fn );
    }else {
        this.ele[ 'on' + type ] = null;
    }
    return this;
};
/**下棋**/
function draw( e ){
    var event = new $().getEvent( e );
    var target = new $(event.target || event.scrElement);
    if( target.hasClass( 'block' ) ){
       if(target.hasClass("black") || target.hasClass("white")){ return; };
       var id = target.toDom().id;
       var row = id.split("_")[1];//行
       var col = id.split("_")[2];//列
       socket.emit("xiaqi", {x: row, y : col, name:name});
       main.chess[row][col] = main.nowState;
       getCount(row, col);
       target.addClass( main.state);
       map.off('click', draw);
    }
    event.stopPropagation();
}

function serverDraw(x, y){
    main.chess[x][y] = main.nowState;
    getCount(x, y);
    new $("#block_" + x + "_" + y ).addClass(main.state);
    map.on('click', draw);
}

function getCount(x, y){
    var color = main.nowState, row, col, count = 1;
    //竖着
    for(row = Number(x) - 1; row > x - 5 && row >= 0; row--){
        if(main.chess[row][y] === color){
            count++;
            if(count === 5){ isWin(count, color); break;}
        }else{
            break;
        }
    }
    for(row = Number(x) + 1; row < Number(x) + 5 && row <= main.chess.length; row++){
        if(main.chess[row][y] === color){
            count++;
            if(count === 5){ isWin(count, color); break;}
        }else{
            break;
        }
    }
    count = 1;

    //横着
    for(col = Number( y ) - 1; col >= 0 && col > Number(y) - 5; col--){
        if(main.chess[x][col] === color){
            count++;
            if(count === 5){ isWin(count, color); break;}
        }else{
            break;
        }
    }
    for(col = Number( y ) + 1; col <= main.chess[x].length && col < Number(y) + 5; col++){
        if(main.chess[x][col] === color){
            count++;
            if(count === 5){ isWin(count, color); break;}
        }else{
            break;
        }
    }
    count = 1;
    //45°角
    for(col = Number(y) - 1, row = Number(x) - 1; col >= 0 && col > Number(y) - 5 && row > x - 5 && row >= 0; col--, row--){
        if(main.chess[row][col] === color){
            count++;
            if(count === 5){ isWin(count, color); break;}
        }else{
            break;
        }
    }
    for(col = Number(y) + 1, row = Number(x) + 1; col <= main.chess[x].length && col < Number(y) + 5 && row < Number(x) + 5 && row <= main.chess.length; col++, row++){
        if(main.chess[row][col] === color){
            count++;
            if(count === 5){ isWin(count, color); break;}
        }else{
            break;
        }
    }
    count = 1;

    //135°角
    for(col = Number(y) + 1, row = Number(x) - 1; col <= main.chess[x].length && col < Number(y) + 5 && row > Number(x) - 5 && row >= 0; col++, row--){
        if(main.chess[row][col] === color){
            count++;
            if(count === 5){ isWin(count, color); break;}
        }else{
            break;
        }
    }
    for(col = Number(y) - 1, row = Number(x) + 1;  col >= 0 && col > Number(y) - 5 && row < Number(x) + 5 && row <= main.chess.length; col--, row++){
        if(main.chess[row][col] === color){
            count++;
            if(count === 5){ isWin(count, color); break;}
        }else{
            break;
        }
    }
}


function isWin(count, color){
    if(count === 5){
        alert( color + " is win");
        map.off('click', draw)
    }
}
/**开始游戏（重置）**/
function start(){
    createMap( new $("#x").val(), new $("#y").val());
    map = new $("#map"); 
    main.chess = [];
    map.on('click', draw);
}
/**基础数据**/
var main = (function(){
    var state = "black";
    var chess = [];
    var r = {
        get state(){
            var clone = state;
            state = state === "black" ? "white" : "black";
            return clone;
        },
        set state( value ){
            state = value;
        },

        get nowState(){
            return state;
        },
        get chess (){
            if(chess.length === 0){
                for(var i = 0; i < this.size.y; i++){
                    chess[ i ] = [];
                    for(var n = 0; n < this.size.x; n++){
                        chess[ i ].push("");
                    }
                }
            }
            return chess;
        },

        set chess( value ){
            chess = value;
        },
        size : {x : 0, y : 0}

    };
    return r;
}());
var btn = new $("#getMap");
var map;
btn.on("click", start);

