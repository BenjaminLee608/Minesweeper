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

function addMines(height, width){

    for(let i = 0; i < numMines; i++){
        let x = Math.floor(Math.random()*height);
        let y = Math.floor(Math.random()*width);
        var cellData = GRID.rows[x].cells[y];
        if(cellData.getAttribute("cellData") != -1){
            cellData.setAttribute("cellData", -1);
        }
        else{
            i--;
            continue;
        }

    }
}
function setValues(height, width){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            var cellData = GRID.rows[i].cells[j];
            cellData.innerHTML = cellData.getAttribute("cellData");
        }
    }
}

function clickCell(cell){
    var cellData = cell.getAttribute("cellData");
    if(cellData == -1){
        console.log("GAMEOVER");
    }

    else if(!cell.classList.contains("clicked")){
        cell.classList.add("clicked");
        console.log(cell.getAttribute("cellData"));
    }



}

function initalizeGame(height, width){
    createArray(height, width);
    createGrid(height, width);
    addMines(height, width);
    setValues(height, width)
}


console.log("hi");
initalizeGame(height, width);
