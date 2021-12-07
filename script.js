const GRID = document.querySelector("#grid");
const RESETBUTTON = document.querySelector("#reset");
const EASYBUTTON = document.querySelector("#diffEasy");
const HARDBUTTON = document.querySelector("#diffHard");
const TILECOUNTER = document.querySelector("#tileCounter");
const BOMBCOUNTER = document.querySelector("#bombCounter");
const EMOJI = document.querySelector("#emoji");
const TIMER = document.querySelector("#timer");

const LEADERBOARD = [document.querySelector("#firstPlace"),document.querySelector("#secondPlace"),
                        document.querySelector("#thirdPlace"),document.querySelector("#fourthPlace"),document.querySelector("#fifthPlace"),
                        document.querySelector("#sixthPlace"),document.querySelector("#seventhPlace"),document.querySelector("#eighthPlace"),
                        document.querySelector("#ninthPlace"),document.querySelector("#tenthPlace")];


var height = 9;
var width = 9;
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
var bothMouseDown = 0;
var lost = false;
var firstClick = true;

var totalSeconds = localStorage['time'] || 0;

var leaderboardTimes = [];

var stored = localStorage['leaderboardTimes'];

if (stored) leaderboardTimes = JSON.parse(stored);

updateLeaderboard();


console.log(totalSeconds);
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
                if((mouseDown && e.button == 2) || (rightMouseDown && e.button == 0)){
                    bothMouseDown = 1;
                }

                if(bothMouseDown){ // if both mouse are held down, open highlight 3x3 around mouse
                    let x = this.parentNode.rowIndex;
                    let y = this.cellIndex;
                    applyGrid(function(j,k){
                        if(!GRID.rows[j].cells[k].classList.contains("holdDown") && !GRID.rows[j].cells[k].classList.contains("flagged"))GRID.rows[j].cells[k].classList.add("holdDown");
                    }, x,y);

                }
                else if (e.button === 0 && !lost) {
                    mouseDown = 1;
                    emoji.setAttribute("src", "images/shocked.png");
                    if(!this.classList.contains("flagged")){
                        this.classList.add("holdDown");
                    }
                }
                else if(e.button === 2){
                    addFlag(this);
                    rightMouseDown = 1;
                }

            };
            cell.onmouseover = function() {
                if(emoji.getAttribute("src") == "images/smile.png" && !lost && mouseDown){
                    emoji.setAttribute("src", "images/shocked.png");

                }
                if(!cell.classList.contains("clicked") && mouseDown && !this.classList.contains("flagged") && !lost){
                    if(bothMouseDown){ // if both mouse are held down, open highlight 3x3 around mouse
                        let x = this.parentNode.rowIndex;
                        let y = this.cellIndex;
                        applyGrid(function(j,k){
                            if(!GRID.rows[j].cells[k].classList.contains("holdDown") && !GRID.rows[j].cells[k].classList.contains("flagged"))GRID.rows[j].cells[k].classList.add("holdDown");
                        }, x,y);

                    }
                    else{
                        this.classList.add("holdDown");
                    }

                }
            };

            cell.onmouseout = function() {
                if(emoji.getAttribute("src") == "images/shocked.png" && !lost && !mouseDown){
                    emoji.setAttribute("src", "images/smile.png");
                }

                if(bothMouseDown){ // if both mouse are held down, open highlight 3x3 around mouse
                    let x = this.parentNode.rowIndex;
                    let y = this.cellIndex;
                    applyGrid(function(j,k){
                        if(GRID.rows[j].cells[k].classList.contains("holdDown"))GRID.rows[j].cells[k].classList.remove("holdDown");
                    }, x,y);

                }
                else{
                    this.classList.remove("holdDown");
                }

            };
            cell.onmouseup = function(e) {
                if(bothMouseDown){

                    let x = this.parentNode.rowIndex;
                    let y = this.cellIndex;
                    mouseDown = 0;
                    rightMouseDown = 0;
                    bothMouseDown = 0;

                    applyGrid(function(j,k){
                        if(GRID.rows[j].cells[k].classList.remove("holdDown"));
                    }, x,y);
                    if(firstClick){
                        return;
                    }
                    let mineCounter = countMines(x,y);

                    if(mineCounter == GRID.rows[x].cells[y].getAttribute("cellData")){
                        applyGrid(function(j,k){
                            if(!GRID.rows[j].cells[k].classList.contains("flagged")) clickCell(GRID.rows[j].cells[k]);
                        }, x,y);
                    }

                }
                else if (e.button === 0 && !lost) {
                    mouseDown = 0;
                    this.classList.remove("holdDown");
                    clickCell(this);
                    if(TESTING){
                        showAllValues()
                    }
                    updateCounters()
                }
                else if(e.button === 2){
                    rightMouseDown = 0;
                }
            };

            var data = document.createAttribute("cellData");
            data.value = 0;
            var onContextMenu = document.createAttribute("oncontextmenu");
            onContextMenu.value="return false";
            cell.setAttributeNode(onContextMenu);
            cell.setAttributeNode(data);
        }
    }

}

function addMines(num,clickX,clickY){
    for(let i = 0; i < num; i++){
        let x = Math.floor(Math.random()*height);
        let y = Math.floor(Math.random()*width);
        var cellData = GRID.rows[x].cells[y];

        if(cellData.getAttribute("cellData") != -1 && !(x >= clickX-1 && x <= clickX + 1 && y <= clickY + 1 && y >= clickY-1)){
            cellData.setAttribute("cellData", -1);
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

function countMines(x,y){
    let mineCounter = 0;
    for(let j = x-1; j < x+2; j++){
        if(!(j < 0 || j >= height)){
            for(let k = y-1; k < y+2; k++){
                if(!(k < 0 || k >= width)){
                    if(GRID.rows[j].cells[k].classList.contains("flagged")){
                        mineCounter++;
                    }
                }
            }
        }
    }
    return mineCounter;
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
}

function displayTime(){
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

    //Create grid on first click
    if(firstClick){
        timerInterval = setInterval(displayTime,10);
        addMines(numMines,x,y);
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
        checkWinCondition();
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

        totalSeconds = seconds*100 + minutes*6000 + miliseconds/10;
        console.log(totalSeconds);
        localStorage['time'] = totalSeconds;
        addToLeaderBoard(totalSeconds);
        updateLeaderboard();

        emoji.setAttribute("src", "images/sunglasses.png");
        showBombs();
        clearTimer();

    }
}
function addToLeaderBoard(totalSeconds){
    leaderboardTimes.push(totalSeconds);
    leaderboardTimes.sort();

    while(leaderboardTimes.length > 10){
        leaderboardTimes.pop();
    }
    localStorage['leaderboardTimes'] = JSON.stringify(leaderboardTimes);
}

function updateLeaderboard(){
    for(let i = 0; i < leaderboardTimes.length; i++){

        var tempMilis = leaderboardTimes[i]/100;
        LEADERBOARD[i].innerHTML = tempMilis;
    }
}

function initalizeGame(){

    createGrid();

    updateCounters();

    if(TESTING){
        showAllValues()
    }
}

function updateCounters(){
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
EASYBUTTON.addEventListener("click", function(){height=9;width=9;numMines=10; resetGame();}, false);
HARDBUTTON.addEventListener("click", function(){height=16;width=30;numMines=99;numTiles = height*width - numMines; resetGame();}, false);


document.body.onmousedown = function(e){
    if(!lost && !bothMouseDown){
        if (e.button === 0) {
            mouseDown = 1;
        }
        else if(e.button === 2){
            rightMouseDown = 1;
        }

        if(mouseDown && rightMouseDown){
            bothMouseDown = 1;
        }
    }


};


document.body.onmouseup = function(e){
    if(bothMouseDown){
        bothMouseDown = 0;
        mouseDown = 0;
        rightMouseDown = 0;
    }
    else if (e.button === 0) {
        mouseDown = 0;
        if(emoji.getAttribute("src") == "images/shocked.png"){
            emoji.setAttribute("src", "images/smile.png");
        }
    }
    else if(e.button === 2){
        rightMouseDown = 0;
    }
};


initalizeGame();
