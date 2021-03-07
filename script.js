const GRID = document.querySelector("#grid");
const RESETBUTTON = document.querySelector("#reset");
const EASYBUTTON = document.querySelector("#diffEasy");
const HARDBUTTON = document.querySelector("#diffHard");

var difficulty = "beginner";
var height = 8;
var width = 8;
var numMines = 10;
var numTiles = height*width - numMines;
var clicked = 0;

var lost = false;
var firstClick = true;

const TESTING = 0;


/*
var gridArray = new Array(height);
function createArray(){
    for(let i = 0; i < height; i++){
        gridArray[i] = new Array(width);
        for(let j = 0; j < width; j++){
            gridArray[i][j] = 0;
        }
    }
    console.log(gridArray);
}
*/

function createGrid(){

    for(let i = 0; i < height; i++){
        var row = GRID.insertRow(i);
        for(let j = 0; j < width; j++){
            var cell = row.insertCell(j);
            cell.onclick = function(){
                clickCell(this);
            };
            var data = document.createAttribute("cellData");
            data.value = 0;
            cell.setAttributeNode(data);
            //console.log(cell.getAttribute("cellData"));
        }
    }
    //

    console.log(GRID);
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

                    if(GRID.rows[j].cells[k].getAttribute("cellData") == -1){
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
    console.log("reset");
}

function clickCell(cell){
    if(lost){
        return;
    }

    let x = cell.parentNode.rowIndex;
    let y = cell.cellIndex;
    var cellData = cell.getAttribute("cellData");

    if(cellData == -1){
        if(firstClick){
            addMines(1);
            let bombs = 0;
            cell.setAttribute("cellData",0);
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
                    }
                }
            }
            cell.setAttribute("cellData",bombs);
            cell.classList.add("clicked");
            cell.innerHTML = cell.getAttribute("cellData");

            return;
        }

        cell.classList.add("bomb");
        cell.innerHTML = "<img src=\'bomb.png\' alt=\'hello\'/>";
        lost = true;
        showBombs(x,y);
        console.log("GAMEOVER");
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
        console.log(clicked);
        console.log(numTiles);
        checkWinCondition();

        //console.log(cell.getAttribute("cellData"));
    }
    firstClick = false;
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

function clickZeros(x, y){
    var cell = GRID.rows[x].cells[y];
    clicked++;
    cell.classList.add("clicked");
    cell.innerHTML = cell.getAttribute("");
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
    }
}

function initalizeGame(){
    //createArray();
    createGrid();
    addMines(numMines);
    if(TESTING){
        showAllValues()
    }

}

function resetGame(){
    GRID.innerHTML = "";
    initalizeGame();
    hideAllValues();
    lost = false;
    clicked = 0;
    firstClick = true;
    numTiles = height*width - numMines;
}



RESETBUTTON.addEventListener("click", resetGame, false);
EASYBUTTON.addEventListener("click", function(){height=8;width=8;numMines=10;resetGame();}, false);
HARDBUTTON.addEventListener("click", function(){height=16;width=30;numMines=99;numTiles = height*width - numMines;resetGame();}, false);
console.log("hi");
initalizeGame();
