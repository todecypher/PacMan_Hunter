var cols = 25;
var rows = 25;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start;
var end;
var w;
var h;
var path = [];

function removeFromArray(arr, curr){ //can br optimised more
	for(var i = arr.length-1; i >= 0; i--){
		if(arr[i] == curr){
			arr.splice(i, 1);
		}
	}
}

function heuristic(a,b){
	var d = dist(a.i, a.j, b.i, b.j); // dist is P5 func
	return d;
}

//Each block will be initialised and use this function
function Spot(i, j){
	//f(x) = g(x) + h(x)
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbors = [];
	this.previous = undefined;
	this.wall = false;

	if(random(1) < 0.2){
		this.wall = true;
	}

	//this will draw the block on screen
	this.show = function(col){
		fill(col);
		if(this.wall){
			fill(0);
			noStroke();
			//rect(this.i * w, this.j * h, w-1, h-1);
			ellipse(this.i * w + w/2, this.j * h + h/2, w/2, h/2);
		}
		
	}

	this.addNeighbors = function(grid){
		var i = this.i;
		var j = this.j;
		if(i < cols-1){
			this.neighbors.push(grid[i+1][j]);
		}
		if(i > 0){
			this.neighbors.push(grid[i-1][j]);
		}
		if(j < rows-1){
			this.neighbors.push(grid[i][j+1]);
		}
		if(j > 0){
			this.neighbors.push(grid[i][j-1]);
		}
		if(i > 0 && j > 0){
			this.neighbors.push(grid[i-1][j-1]);
		}
		if(i < cols-1 && j > 0){
			this.neighbors.push(grid[i+1][j-1]);
		}
		if(i > 0 && j < rows-1){
			this.neighbors.push(grid[i-1][j+1]);
		}
		if(i < cols-1 && j < rows-1){
			this.neighbors.push(grid[i+1][j+1]);
		}
		
	}
}

function setup(){
    createCanvas(400, 400);
    console.log('a*');

    //for aliging the blocks according to size of canvas
    w = width/cols;
    h = height/rows;

    //making 2D Array
	for(var i = 0; i<cols; i++){
		grid[i] = new Array(rows);
	}

	//making all the spots
	for(var i = 0; i<cols; i++){
		for(var j = 0; j<rows; j++){
			grid[i][j] = new Spot(i, j);
		}
	}

	//getting neighbors of all nodes
	for(var i = 0; i<cols; i++){
		for(var j = 0; j<rows; j++){
			grid[i][j].addNeighbors(grid);
		}
	}

	//starting and ending index
	start = grid[0][0];
	end = grid[cols-1][rows-1];

	//maikng sure start and end are not walls
	start.wall = false;
	end.wall = false;

	//pushing start in openlist
	openSet.push(start);

	//printing grid	
	console.log.grid;
}

//it is function in P5 lib which contineously runs (loops) to make image
function draw(){

	frameRate(5);
	var current;
	var pri;

	if (openSet.length > 0){
		
		//keep looping through openList
		var winner = 0; //element to be itr next
		for(var i = 0; i < openSet.length; i++){
			if(openSet[i].f < openSet[winner].f){ // finding min F in the open list
				winner = i;
			}
		}

		current = openSet[winner];
		pri = current;
		
		if(current === end){
			
			noLoop();
			console.log("Done");
		}

		removeFromArray(openSet, current); // function to remove current from openSet (need to make function since no other way to remove from array)
		closedSet.push(current); //add to closed set

		//iterating neighbors
		var neighbors = current.neighbors;
		for(var i = 0; i < neighbors.length; i++){
			var neighbor = neighbors[i];

			if(!closedSet.includes(neighbor) && !neighbor.wall){
				var tempG = current.g + 1; //adding 1 to G value to denote distance

				//check whether curr neighbor is already evaluated
				var newPath = false; // to check whether better path found or not
				if(openSet.includes(neighbor)){ //path already under consideration
					if(tempG < neighbor.g){ // better path found
						neighbor.g = tempG;
						newPath = true;
					}
				}
				else{
					neighbor.g = tempG; //not yet considered
					newPath = true;
					openSet.push(neighbor);
				}

				if(newPath){
					neighbor.h = heuristic(neighbor, end);	//finding h
					neighbor.f = neighbor.g + neighbor.h;	//finding f
					neighbor.previous = current;			//storing previous so that path can be iterated
				}
				
			}

		}


		
	}
	else{
		//No possible solution
		console.log("No solution");
		noLoop();
		return;
	}

    background(255);

    fill(255,0,255);
    ellipse(pri.i*w, pri.j*w, w, h);

    for(var i = 0; i < cols; i++){
    	for(var j = 0; j < rows; j++){
    		grid[i][j].show(color(255));
    	}
    }

    for(var i = 0; i < closedSet.length; i++){
    	closedSet[i].show(color(255,0,0));
    }

    for(var i = 0; i < openSet.length; i++){
    	openSet[i].show(color(0,255,0));
    }


    //Finding path after each itr ends
	path = [];
	var temp = current;
	path.push(temp);
	while(temp.previous){
		path.push(temp.previous);
		temp = temp.previous;
	}
    for(var i = 0; i < path.length; i++){
    	path[i].show(color(0,0,255));
    }

    
	





    // noFill();
    // stroke(255, 0, 255);
    // strokeWeight(w/2);

    // beginShape();
    // for(var i = 0; i < path.length; i++){

    // 	vertex(path[i].i * w + w/2, path[i].j * h + h/2);
    // }
    // endShape();


	

}


