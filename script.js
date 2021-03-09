const GRID = document.querySelector("#grid");
const RESETBUTTON = document.querySelector("#reset");
const EASYBUTTON = document.querySelector("#diffEasy");
const HARDBUTTON = document.querySelector("#diffHard");
const TILECOUNTER = document.querySelector("#tileCounter");
const BOMBCOUNTER = document.querySelector("#bombCounter");
const EMOJI = document.querySelector("#emoji");
const TIMER = document.querySelector("#timer");

var difficulty = "beginner";
var height = 8;
var width = 8;
var numMines = 10;
var numTiles = height*width - numMines;
var clicked = 0;
var flagCounter = 0;
var miliseconds = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var timerInterval;


var lost = false;
var firstClick = true;

const TESTING = 0;

function createGrid(){

    for(let i = 0; i < height; i++){
        var row = GRID.insertRow(i);
        for(let j = 0; j < width; j++){
            var cell = row.insertCell(j);
            cell.onclick = function(){
                clickCell(this);
                if(TESTING){
                    showAllValues()
                }
                updateCounters()
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

function addMines(num){

    for(let i = 0; i < num; i++){
        let x = Math.floor(Math.random()*height);
        let y = Math.floor(Math.random()*width);
        var cellData = GRID.rows[x].cells[y];
        if(cellData.getAttribute("cellData") != -1){
            cellData.setAttribute("cellData", -1);
            for(let j = x-1; j < x+2; j++){
                if(j < 0 || j >= height){
                    continue;
                }
                for(let k = y-1; k < y+2; k++){
                    if(k< 0 || k >= width){
                        continue;
                    }

                    if(GRID.rows[j].cells[k].getAttribute("cellData") < 0){
                        continue;
                    }
                    else{
                        GRID.rows[j].cells[k].setAttribute("cellData", parseInt(GRID.rows[j].cells[k].getAttribute("cellData"))+1) ;
                    }
                }
            }

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

function countBombs(x,y){
    let bombs = 0;
    for(let j = x-1; j < x+2; j++){
        if(j < 0 || j >= height){
            continue;
        }
        for(let k = y-1; k < y+2; k++){
            if(k< 0 || k >= width){
                continue;
            }

            if(GRID.rows[j].cells[k].getAttribute("cellData") == -1){
                bombs++;
                //console.log("bombX: " + j + " bombY: " + k);
            }
        }
    }
    return bombs;
}
function countBombs2(x,y){
    let bombs = 0;
    for(let j = x-1; j < x+2; j++){
        if(j < 0 || j >= height){
            continue;
        }
        for(let k = y-1; k < y+2; k++){
            if(k< 0 || k >= width){
                continue;
            }

            if(GRID.rows[j].cells[k].getAttribute("cellData") == -1){
                bombs++;
                GRID.rows[j].cells[k].setAttribute("cellData", -2);
                //console.log("bombX: " + j + " bombY: " + k + " newData: " + GRID.rows[j].cells[k].getAttribute("cellData"));
            }
        }
    }
    return bombs;
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

    let ms = (miliseconds/10);

    let sec = seconds;
    if (seconds < 10 || seconds == 0) {
      sec = '0' + seconds;
    }
    let min = minutes;
    if (min < 10 || min == 0) {
      min = '0' + minutes;
    }
    let hr = "";
    if (hr > 0 && hr < 10) {
        hr = '0' + hours + ':';
    }

    timer.innerHTML = hr + min + ':' + sec + ':' + ms;

}

function clickCell(cell){
    if(lost || cell.classList.contains("flagged")){
        return;
    }
    let x = cell.parentNode.rowIndex;
    let y = cell.cellIndex;
    var cellData = cell.getAttribute("cellData");

    if(firstClick){
        console.log(TIMER.innerHTML);
        timerInterval = setInterval(displayTime,10);
        console.log();
    }
//FIRST CLICK (guarenteed 3x3)
    while(firstClick && cellData != 0){
        firstClick = false;
        bombs = countBombs2(x,y); //bombs = number of bombs surrounding click

        if(!bombs){ //If there's no bombs
            break;
        }

        //console.log(bombs);
        //if(TESTING) console.log("bombs1: " + bombs);
        for(let j = x-1; j < x+2; j++){ // sets all squares next to click to bombs (so that when we add new bombs they cannot be in this square)
            if(j < 0 || j >= height){
                continue;
            }
            for(let k = y-1; k < y+2; k++){
                if(k< 0 || k >= width){
                    continue;
                }
                if(TESTING){
                    console.log("x: " + x  + ", y: " + y);
                    console.log(j + ", " + k);

                }
                if(GRID.rows[j].cells[k].getAttribute("cellData") != -2){
                    GRID.rows[j].cells[k].setAttribute("cellData",-1);
                }

            }
        }
        addMines(bombs); //Adds enough bombs to replace old bombs

        for(let i = x-1; i < x+2; i++){ // sets everything around click to 0
            if(i < 0 || i >= height){
                continue;
            }
            for(let j = y-1; j < y+2; j++){
                if(j< 0 || j >= width){
                    continue;
                }
                if(GRID.rows[i].cells[j].getAttribute("cellData") == -2){
                    for(let k = i-1; k < i+2; k++){
                        if(k < 0 || k >= height){
                            continue;
                        }
                        for(let l =j-1; l < j+2; l++){
                            if(l< 0 || l >= width){
                                continue;
                            }
                            if(GRID.rows[k].cells[l].getAttribute("cellData") > -1){
                                GRID.rows[k].cells[l].setAttribute("cellData", GRID.rows[k].cells[l].getAttribute("cellData")-1);
                            }
                        }
                    }

                    //console.log("asdf " + i+ " + " + j);
                }

            }
        }





        for(let j = x-1; j < x+2; j++){ // sets everything around click to 0
            if(j < 0 || j >= height){
                continue;
            }
            for(let k = y-1; k < y+2; k++){
                if(k< 0 || k >= width){
                    continue;
                }
                GRID.rows[j].cells[k].setAttribute("cellData", 0);
            }
        }

        for(let j = x-1; j < x+2; j++){ // Sets all values around mouseclick to correct value
            if(j < 0 || j >= height){
                continue;
            }
            for(let k = y-1; k < y+2; k++){
                if(k< 0 || k >= width){
                    continue;
                }
                newCell = GRID.rows[j].cells[k];
                bombs = countBombs(j,k);
                newCell.setAttribute("cellData",bombs);
            }
        }

        for(let j = x-1; j < x+2; j++){ //Clicks all non-zero values around cursor
            if(j < 0 || j >= height){
                continue;
            }
            for(let k = y-1; k < y+2; k++){
                if(k< 0 || k >= width){
                    continue;
                }
                newCell = GRID.rows[j].cells[k];
                if(!newCell.classList.contains("clicked") && cell!= 0){
                    clickCell(newCell);
                }
                else if(!newCell.classList.contains("clicked") && cell == 0){
                    clickZero(newCell);
                }
            }
        }
/*
        for(let j = x-1; j < x+2; j++){ //Clicks all zero values around cursor
            if(j < 0 || j >= height){
                continue;
            }
            for(let k = y-1; k < y+2; k++){
                if(k< 0 || k >= width){
                    continue;
                }
                if(!cell.classList.contains("clicked")){
                    newCell = GRID.rows[j].cells[k];
                    clickCell(newCell);
                }
            }
        }
*/
        //console.log(clicked);
        //console.log(numTiles);

        return;
    }

//End of firstClick
    firstClick = false;

    if(cellData == -1){
        cell.classList.add("bomb");
        cell.innerHTML = "<img src=\'bomb.png\' class=\'flag\' alt=\'hello\'/>";
        clearTimer();
        timerInterval = null;
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
                GRID.rows[i].cells[j].innerHTML = "<img src=\'bomb.png\' alt=\'hello\'/>";
            }
        }
    }
}

function clearTimer(){
    if(timerInterval != null){
        clearInterval(timerInterval);
        timerInterval = null;
    }
    miliseconds = 0;
    second = 0;
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
    for(let j = x-1; j < x+2; j++){
        if(j < 0 || j >= height){
            continue;
        }
        for(let k = y-1; k < y+2; k++){
            if(k< 0 || k >= width){
                continue;
            }
            cell = GRID.rows[j].cells[k]
            if(cell.getAttribute("cellData") == 0 && !cell.classList.contains("clicked")){
                clickZeros(j,k);
            }else{
                clickCell(GRID.rows[j].cells[k]);
            }
        }
    }
}

function checkWinCondition(){
    if(clicked == numTiles){
        console.log("Win!");
        emoji.setAttribute("src", "sunglasses.png");
        showBombs();
        clearTimer();
        timerInterval = null;


    }
}

function initalizeGame(){
    //createArray();
    createGrid();
    addMines(numMines);
    updateCounters()

    if(TESTING){
        showAllValues()
    }
}

function updateCounters(){
    //TILECOUNTER.innerHTML = clicked;
    //BOMBCOUNTER.innerHTML = numMines - flagCounter;
}

function addFlag(cell){
    if(!cell.classList.contains("clicked") && !firstClick && !lost){
        if(cell.classList.contains("flagged")){
            cell.classList.remove("flagged");
            cell.innerHTML = "";
        }
        else{
            cell.innerHTML = "<img src=\'flag.png\' alt=\'hello\'/>";
            cell.classList.add("flagged");
        }


    }


}

function resetGame(){
    GRID.innerHTML = "";
    timer = 0;
    initalizeGame();
    clearTimer();
    timerInterval = null;
    TIMER.innerHTML = "00:00:00";
    hideAllValues();
    lost = false;
    clicked = 0;
    firstClick = true;
    numTiles = height*width - numMines;
    emoji.setAttribute("src", "sad.png");
    updateCounters()
    if(TESTING){
        showAllValues()
    }
}

RESETBUTTON.addEventListener("click", resetGame, false);
EASYBUTTON.addEventListener("click", function(){height=8;width=8;numMines=10;resetGame();}, false);
HARDBUTTON.addEventListener("click", function(){height=16;width=30;numMines=99;numTiles = height*width - numMines;resetGame();}, false);
console.log("hi");
initalizeGame();
