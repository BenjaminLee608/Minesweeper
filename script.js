const GRID = document.querySelector("#grid");

var difficulty = "beginner";
var height = 8;
var width = 8;
var numMines = 10;
var gridArray = new Array(height);

function createArray(height, width){
    for(let i = 0; i < height; i++){
        gridArray[i] = new Array(width);
        for(let j = 0; j < width; j++){
            gridArray[i][j] = 0;
        }
    }
    console.log(gridArray);
}


function createGrid(height, width){

    for(let i = 0; i < height; i++){
        var row = GRID.insertRow(i);
        for(let j = 0; j < width; j++){
            row.insertCell(j);

        }
    }
    //

    console.log(GRID);
}

function initalizeGame(height, width){
    createArray(height, width);
    createGrid(height, width);
}

initalizeGame(height, width);
