const GRID = document.querySelector("#grid");
const RESETBUTTON = document.querySelector("#reset");

var difficulty = "beginner";
var height = 8;
var width = 8;
var numMines = 10;
var gridArray = new Array(height);


var clicked = 0;


const TESTING = 0;

function createArray(){
    for(let i = 0; i < height; i++){
        gridArray[i] = new Array(width);
        for(let j = 0; j < width; j++){
            gridArray[i][j] = 0;
        }
    }
    console.log(gridArray);
}


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

function addMines(){

    for(let i = 0; i < numMines; i++){
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
    var cellData = cell.getAttribute("cellData");
    if(cellData == -1){
        console.log("GAMEOVER");
    }

    else if(!cell.classList.contains("clicked")){
        let x = cell.parentNode.rowIndex;
        let y = cell.cellIndex;
        if(cellData == 0){
            clickZeros(x, y);
        }
        else{
            cell.classList.add("clicked");
            cell.innerHTML = cell.getAttribute("cellData");
        }



        //console.log(cell.getAttribute("cellData"));
    }
}

function clickZeros(x, y){
    var cell = GRID.rows[x].cells[y];
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



function initalizeGame(){
    createArray();
    createGrid();
    addMines();
    if(TESTING){
        showAllValues()
    }

}

function resetGame(){

    initalizeGame();
    hideAllValues();
}



RESETBUTTON.addEventListener("click", resetGame, false);

console.log("hi");
initalizeGame();
