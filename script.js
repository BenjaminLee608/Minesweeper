const GRID = document.querySelector("#grid");
const RESETBUTTON = document.querySelector("#reset");
const EASYBUTTON = document.querySelector("#diffEasy");
const HARDBUTTON = document.querySelector("#diffHard");
const TILECOUNTER = document.querySelector("#tileCounter");
const BOMBCOUNTER = document.querySelector("#bombCounter");
const EMOJI = document.querySelector("#emoji");
const TIMER = document.querySelector("#timer");

var height = 8;
var width = 8;
var numMines = 10;
var numTiles = height*width - numMines;
var clicked = 0;
var bombsLeft = numMines;
var miliseconds = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var timerInterval = null;
var mouseDown = 0;
var rightMouseDown = 0;
var lost = false;
var firstClick = true;
const TESTING = 0;

// 3x3 function
function applyGrid(applyFunction, x, y){

    for(let j = x-1; j < x+2; j++){
        if(!(j < 0 || j >= height)){
            for(let k = y-1; k < y+2; k++){
                if(!(k < 0 || k >= width)){
                    applyFunction(j,k);
                }
            }
        }
    }
}

function createGrid(){

    for(let i = 0; i < height; i++){
        var row = GRID.insertRow(i);
        for(let j = 0; j < width; j++){
            var cell = row.insertCell(j);
            cell.onmousedown = function(e){
                if (e.button === 0 && !lost) {
                    mouseDown = 1;
                    emoji.setAttribute("src", "images/shocked.png");
                    if(!this.classList.contains("flagged")){
                        this.classList.add("holdDown");
                    }
                }
            };
            cell.onmouseover = function() {
                if(emoji.getAttribute("src") == "images/smile.png" && !lost && mouseDown){
                    emoji.setAttribute("src", "images/shocked.png");

                }
                if(!cell.classList.contains("clicked") && mouseDown && !this.classList.contains("flagged") && !lost){
                    //console.log("x: " + x + "y: " + y);
                    this.classList.add("holdDown");
                }
            };

            cell.onmouseout = function() {
                if(emoji.getAttribute("src") == "images/shocked.png" && !lost && !mouseDown){
                    emoji.setAttribute("src", "images/smile.png");
                }
                this.classList.remove("holdDown");
            };
            cell.onmouseup = function(e) {
                if (e.button === 0 && !lost) {
                    this.classList.remove("holdDown");
                    clickCell(this);
                    if(TESTING){
                        showAllValues()
                    }
                    updateCounters()
                }
            };

            var data = document.createAttribute("cellData");
            data.value = 0;
            var onContextMenu = document.createAttribute("oncontextmenu");
            onContextMenu.value="addFlag(this); return false";
            cell.setAttributeNode(onContextMenu);
            cell.setAttributeNode(data);
            //console.log(cell.getAttribute("cellData"));
        }
    }
    //

    //console.log(GRID);
}

function addMines(num,clickX,clickY){
    for(let i = 0; i < num; i++){
        let x = Math.floor(Math.random()*height);
        let y = Math.floor(Math.random()*width);
        var cellData = GRID.rows[x].cells[y];

        if(cellData.getAttribute("cellData") != -1 && !(x >= clickX-1 && x <= clickX + 1 && y <= clickY + 1 && y >= clickY-1)){
            cellData.setAttribute("cellData", -1);
            //console.log("added bomb on: " + x + ", " + y);
            applyGrid(function(j,k){
                if(GRID.rows[j].cells[k].getAttribute("cellData") >= 0){
                    GRID.rows[j].cells[k].setAttribute("cellData", parseInt(GRID.rows[j].cells[k].getAttribute("cellData"))+1) ;
                }

            },x,y);
        }
        else{
            i--;
            continue;
        }
    }
}
function showAllValues(){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            var cellData = GRID.rows[i].cells[j];
            cellData.innerHTML = cellData.getAttribute("cellData");
        }
    }
}
function hideAllValues(){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            var cellData = GRID.rows[i].cells[j];
            cellData.innerHTML = "";
        }
    }
    //console.log("reset");
}

function displayTime(){
    //console.log(miliseconds);
    miliseconds+= 10;
    if(miliseconds > 999){
        seconds++;
        miliseconds-=1000;
    }
    if(seconds > 59){
        minutes++;
        seconds-=60;
    }
    if(minutes > 59){
        hours++;
        seconds-=60;
    }

    msFloor = miliseconds/10;

    let sec = seconds;
    if (seconds < 10) {
      sec = '0' + seconds;
    }
    let min = minutes;
    if (min < 10) {
      min = '0' + minutes;
    }
    let hr = "";
    if (hr > 0 && hr < 10) {
        hr = '0' + hours + ':';
    }
    let ms = msFloor;
    if (msFloor < 10) {
        ms = '0' + msFloor;
    }

    TIMER.innerHTML = hr + min + ':' + sec + ':' + ms;

}

function clickCell(cell){
    if(lost || cell.classList.contains("flagged")){
        return;
    }
    let x = cell.parentNode.rowIndex;
    let y = cell.cellIndex;
    var cellData = cell.getAttribute("cellData");

    //console.log(miliseconds);
    //Create grid on first click
    if(firstClick){
        //console.log(TIMER.innerHTML);
        timerInterval = setInterval(displayTime,10);
        //console.log("FIRST CLICK ON: " + x + ", " + y);
        addMines(numMines,x,y);
        //console.log("end of first clickv");
    }

//End of firstClick
    firstClick = false;

    if(cellData == -1){
        cell.classList.add("bomb");
        emoji.setAttribute("src", "images/dead.png");
        cell.innerHTML = "<img src=\'images/bomb.png\' class=\'flag\' alt=\'hello\'/>";
        clearTimer();
        lost = true;
        showBombs(x,y);
        //console.log("GAMEOVER");
    }

    else if(!cell.classList.contains("clicked")){
        if(cellData == 0){
            clickZeros(x, y);
        }
        else{
            clicked++;
            cell.classList.add("clicked");
            cell.innerHTML = cell.getAttribute("cellData");
        }
        //console.log(clicked);
        //console.log(numTiles);
        checkWinCondition();

        //console.log(cell.getAttribute("cellData"));
    }

}

function showBombs(x,y){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            if(GRID.rows[i].cells[j].getAttribute("cellData") == -1 && (i != x || j != y)){
                GRID.rows[i].cells[j].innerHTML = "<img src=\'images/bomb.png\' alt=\'hello\'/>";
            }
        }
    }
}

function clearTimer(){
    if(timerInterval != null){
        clearInterval(timerInterval);
    }
    miliseconds = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
}

function clickZeros(x, y){
    if(GRID.rows[x].cells[y].classList.contains("flagged")){
        return;
    }
    var cell = GRID.rows[x].cells[y];
    clicked++;
    cell.classList.add("clicked");
    cell.innerHTML = "";

    applyGrid(function(j,k){

        cell = GRID.rows[j].cells[k]
        if(cell.getAttribute("cellData") == 0 && !cell.classList.contains("clicked")){
            clickZeros(j,k);
        }else{
            clickCell(GRID.rows[j].cells[k]);
        }
    },x,y);



}

function checkWinCondition(){
    if(clicked == numTiles){ // WIN! add a score to the Leaderboard
        console.log("Win!");
        emoji.setAttribute("src", "images/sunglasses.png");
        showBombs();
        clearTimer();

    }
}

function initalizeGame(){
    //createArray();
    createGrid();

    updateCounters();

    if(TESTING){
        showAllValues()
    }
}

function updateCounters(){
    //TILECOUNTER.innerHTML = clicked;
    //BOMBCOUNTER.innerHTML = numMines - flagCounter;
    BOMBCOUNTER.innerHTML = "Bomb Counter: " + bombsLeft;
}

function addFlag(cell){
    if(!cell.classList.contains("clicked") && !firstClick && !lost){
        if(cell.classList.contains("flagged")){
            cell.classList.remove("flagged");
            cell.innerHTML = "";
            bombsLeft++;

        }
        else{
            cell.innerHTML = "<img src=\'images/flag.png\' alt=\'hello\'/>";
            cell.classList.add("flagged");
            bombsLeft--;
        }
        updateCounters();

    }


}

function resetValues(){
    //timer = 0;
    lost = false;
    clicked = 0;
    firstClick = true;
    numTiles = height*width - numMines;
    bombsLeft = numMines;
    emoji.setAttribute("src", "images/smile.png");
}
function resetGame(){

    GRID.innerHTML = "";

    initalizeGame();
    clearTimer();
    resetValues()
    hideAllValues();
    updateCounters()
}

RESETBUTTON.addEventListener("click", function(){resetGame();}, false);
EASYBUTTON.addEventListener("click", function(){height=8;width=8;numMines=10; resetGame();}, false);
HARDBUTTON.addEventListener("click", function(){height=16;width=30;numMines=99;numTiles = height*width - numMines; resetGame();}, false);

document.body.onmouseup = function(e){
    if (e.button === 0 && !lost) {
        mouseDown = 1;
    }
};

document.body.onmouseup = function(e){
    if (e.button === 0) {
        mouseDown = 0;
        if(emoji.getAttribute("src") == "images/shocked.png"){
            emoji.setAttribute("src", "images/smile.png");
        }
    }
};

console.log("hi");



initalizeGame();
