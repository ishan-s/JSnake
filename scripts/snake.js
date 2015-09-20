var timer;
var DIR = { up:1, down:2, left:3, right:4};
var cDirection = DIR.right;
var canvasg = document.getElementById('game');
var life = 0;
var foodx;
var foody;
var bonusx;
var bonusy;
var ate = true;
var ateBonus = true;
var score = 0;
var scoreE = document.getElementById('nscore');



console.log(JSON.stringify(canvasg));
var ctx = canvasg.getContext('2d');
var CELL_SIZE = 10;
var numCellsX = canvasg.width / CELL_SIZE;
var numCellsY = canvasg.height / CELL_SIZE;


function changeDifficulty(v){
    clearTimeout(timer);
    console.log("Difficulty: "+v.value);
    
    timer = setInterval(redraw, Number(v.value));
    document.activeElement.blur();
}

function colorCell(ctx, cellx, celly, rgbColor){
    ctx.fillStyle = rgbColor;
    
    var cellxcoord = cellx * CELL_SIZE + 1;
    var cellycoord = celly * CELL_SIZE + 1;
    ctx.fillRect(cellxcoord, cellycoord, CELL_SIZE, CELL_SIZE);
}

function drawSnake(){
    for(var i=0; i<snake.bsize; i++){
      //  console.log("Coloring: "+JSON.stringify(snake.sbody.cell[i]));
       // console.log("***"+i);
        colorCell(ctx, snake.sbody.cell[i].x, snake.sbody.cell[i].y, "rgb(50,50,50)");
    }
}

function reset(){
    location.reload();
}
function drawFood(newfood){
    if(newfood){
    foodx = Math.floor(Math.random()*numCellsX);
    foody = Math.floor(Math.random()*numCellsY);
    ate = false;
    }

    colorCell(ctx, foodx, foody, "rgb(50, 150, 50)");
}

function drawBonus(newBonus, ateB){
    if(newBonus){
    bonusx = Math.floor(Math.random()*numCellsX);
    bonusy = Math.floor(Math.random()*numCellsY);
    ateBonus = false;
    }
    if(ateB || bonusLife<=0){
        bonusx=-1; bonusy=-1;
    }
    
    if(life%2==0)
        colorCell(ctx, bonusx, bonusy, "rgb(255, 0, 0)");
    else
        colorCell(ctx, bonusx, bonusy, "rgb(255, 200, 0)");
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvasg.width, canvasg.height);
}

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

    switch(key){
        case 37:
            if(cDirection!=DIR.right){
                cDirection = DIR.left;
            }
            else{
                console.log("Invalid direction switch");
            }
            break;
            
        case 38:
            if(cDirection!=DIR.down){
            cDirection = DIR.up;
            }
            else{
                console.log("Invalid direction switch");
            }
            break;
            
        case 39:
            if(cDirection!=DIR.left){
            cDirection = DIR.right;
            }
            else{
                console.log("Invalid direction switch");
            }
            break;
            
        case 40:
            if(cDirection!=DIR.up){
            cDirection = DIR.down;
            }
            else{
                console.log("Invalid direction switch");
            }
            break;
            
        case 71:
            growSnake(1);
            break;
    }
   
    console.log("snake.direction = "+cDirection);
}

var cell = {
    x:0,
    y:0,
    state:1
}

var snake = {
    x:1,
    y:0,
    direction: DIR.right,
    bsize:5,
    sbody:{
        cell:[
        {
            x:1,
            y:0,
            state:1
        },
        {
            x:1,
            y:0,
            state:1
        },
        {
            x:1,
            y:0,
            state:1
        },
        {
            x:1,
            y:0,
            state:1
        },
        {
            x:1,
            y:0,
            state:1
        }
    ]
    }
}

function init(){
    for(var j=0; j<snake.bsize; j++)
        console.log("INIT: "+JSON.stringify(snake.sbody.cell[j]));
    timer = setInterval(redraw, 75);
}

var bonusLife = 40;
function redraw(){
    //console.log("redraw");
    life++;
    clearCanvas();
    moveHead();
    
    console.log("Head[x="+snake.x+", y="+snake.y+"]");
    //console.log(JSON.stringify(snake.sbody));
    if(life%10==0){
        drawFood(ate);
    }else{
        drawFood(false);
    }
    
    if(life%100==0){
        bonusLife=40;
        drawBonus(true, false);
    }
    else{
        drawBonus(false, ateBonus);
        bonusLife--;
    }
    
    drawSnake();
}

function updateScore(){
    scoreE.innerHTML = score;
}
function moveHead(){
        switch(cDirection){
            case DIR.up:
                snake.y = snake.y-1;
                if(snake.y<0)
                    snake.y=numCellsY-1;
                break;
            case DIR.down:
                snake.y = snake.y+1;
                if(snake.y>(numCellsY-1))
                    snake.y=0;
                break;
            case DIR.left:
                snake.x = snake.x-1;
                if(snake.x<0)
                    snake.x=numCellsX-1;
                break;
            case DIR.right:
                snake.x = snake.x+1;
                if(snake.x>(numCellsX-1))
                    snake.x=0;
                break;
    }
    snake.sbody.cell[0].x = snake.x;
    snake.sbody.cell[0].y = snake.y;
    
    if(collision()){
        gameOver();
        return;
    }
    
    if(snake.sbody.cell[0].x==foodx && snake.sbody.cell[0].y==foody){
        growSnake(1);
        ate = true;
        
        score+=10;
        updateScore();
    }
        if(snake.sbody.cell[0].x==bonusx && snake.sbody.cell[0].y==bonusy){
        growSnake(1);
        ateBonus = true;
        
        score+=100;
        updateScore();
    }
    
    moveBody();
    
}


function moveBody(){
  
    var tempx = snake.x;
    var tempy = snake.y;
    
    var oldx = new Array();
    var oldy = new Array();
    
    oldx[0] = snake.sbody.cell[0].x;
    oldy[0] = snake.sbody.cell[0].y;
    
    for(var i=1; i<snake.bsize; i++){
        //console.log("* Cell "+i+" - "+JSON.stringify(snake.sbody.cell[i]));
        //console.log("cell["+i+"].x = "+snake.sbody.cell[i].x+", setting to cell["+(i-1)+"].x = "+snake.sbody.cell[i-1].x);
        
        oldx[i] = snake.sbody.cell[i].x;
        oldy[i] = snake.sbody.cell[i].y;
        
        snake.sbody.cell[i].x = snake.sbody.cell[i-1].x;
        snake.sbody.cell[i].y = snake.sbody.cell[i-1].y;
    }
    
    for(var i=1; i<snake.bsize; i++){
        snake.sbody.cell[i].x = oldx[i-1];
        snake.sbody.cell[i].y = oldy[i-1];
    }
    
    //console.log("Snake after moveBody() - "+JSON.stringify(snake));
}

function collision(){
    var isCollision = false;
    for(var k=1; k<snake.bsize; k++){
        if(snake.x==snake.sbody.cell[k].x && snake.y==snake.sbody.cell[k].y && life>snake.bsize){
            isCollision = true;
            console.log("Collision: "+isCollision+" between [0] & ["+k+"]");
        }
    }
    
    return isCollision;
}

function gameOver(){
    //ctx.clearRect(0, 0, canvasg.width, canvasg.height);
    document.getElementById("gameover").className = "gameOverVisible";
    clearTimeout(timer);
}
function growSnake(s){
    var bysize = Number(s);
    
    var newCell = { 
        x:snake.sbody.cell[snake.sbody.cell.length-1].x,
        y:snake.sbody.cell[snake.sbody.cell.length-1].y,
        state:1
    };
    snake.sbody.cell.push(newCell);
    snake.bsize++;
}