
//Help taken from Coding Train Youtube Channel - Daniel Shiffman
//Authors : Satyajit Singh - todecypher.github.io xinus404@gmail.com
//		   Kamal Mehra 	  - kamalmehra.github.io krrish.mehra6@gmail.com
//		   Swaraj Patel   - swaraj-patel.github.io	swarajpatel001@gmail.com


var cols = 27;
var rows = 27;
var grid = new Array(rows);
var openSet = [];
var closedSet = [];
var start;
var end;
var w;
var h;
var path = [];
var blueprint;
var level;
var G;

var target;
var pacman;

var n_guards = 2;
var guards =[];
var pact =[];

var pac = [];
var food = [];

var ind =0;

var guardPath = [];
var indG;
let slider;



function removeFromArray(arr, curr){ //can br optimised more
	for(var i = arr.length-1; i >= 0; i--){
		if(arr[i] == curr){
			arr.splice(i, 1);
		}
	}
}

function generateFood(){
		var x=Math.floor(random(0,27));
		var y=Math.floor(random(0,27));

		while(blueprint[x][y]=='W'){
		    x=Math.floor(random(0,27));
		    y=Math.floor(random(0,27));
		}

		food.push(x);
		food.push(y);

		level.cell_w = Math.ceil(width / 27); 
		level.cell_h = Math.ceil(height / 27);

		target = new Pellet(food[1] * level.cell_w, food[0] * level.cell_h, level.cell_w, level.cell_h,1);

}

function generatePacman(){
	   var x=Math.floor(random(0,27));
	   var y=Math.floor(random(0,27));
	   // pacman = target;
	    while(blueprint[x][y]=='W' ||  (target == pacman)){
	        x=Math.floor(random(0,27));
	        y=Math.floor(random(0,27));
	   }

	   pac.push(x);
	   pac.push(y);

	  level.cell_w = Math.ceil(width / 27); 
	  level.cell_h = Math.ceil(height / 27);

	  pacman = new Pellet(pac[1] * level.cell_w, pac[0] * level.cell_h, level.cell_w, level.cell_h,2);
	  
}


function generateGuards(){
	   var x=Math.floor(random(0,27));
	   var y=Math.floor(random(0,27));

	   guards=[];

	  for(var i  =0 ; i<n_guards;i++){
	      while(blueprint[x][y]=='W' ||  (guards[i] == pacman) || (guards[i]==target) ){
	          x=Math.floor(random(0,27));
	          y=Math.floor(random(0,27));
	       }

	    pact=[];
	    pact.push(x);
	    pact.push(y);

	    level.cell_w = Math.ceil(width / 27); 
	    level.cell_h = Math.ceil(height / 27);

	    guards.push(new Pellet(pact[1] * level.cell_w, pact[0] * level.cell_h, level.cell_w, level.cell_h,3));
	    x=Math.floor(random(0,27));
	    y=Math.floor(random(0,27));

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
		
	}
}


function AstarPacman(){
	var current;
	var pri;
	while(1){
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
			
			path = [];
			var temp = current;
			path.push(temp);
			while(temp.previous){
				path.push(temp.previous);
				temp = temp.previous;
			}
			ind = path.length-1;
			break;
			console.log(path);
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

   
  
    //Finding path after each itr ends
	path = [];
	var temp = current;
	path.push(temp);
	while(temp.previous){
		path.push(temp.previous);
		temp = temp.previous;
	}

	}

}
function AstarGuard(){
	guardOpen = [];
	guardClose =[];
	

	for(var i = 0; i< rows; i++){
    	for(var j = 0; j< cols; j++){
    		grid[i][j] = new Spot(i,j);
    		if(blueprint[j][i] == 'W')
    			grid[i][j].wall = true;

    	}
    }
    for(var i = 0; i<cols; i++){
		for(var j = 0; j<rows; j++){
			grid[i][j].addNeighbors(grid);
		}
	}
	
	var start = grid[pact[1]][pact[0]];
	start.wall = false;

	var k = path[path.length-1];
	var end = grid[k.i][k.j];
	end.wall = false;
    guardOpen.push(start);

    var currInd = path.length-1;


	var current;
	var pri;
	while(1){
	if (guardOpen.length > 0){
		
		//keep looping through openList
		var winner = 0; //element to be itr next
		for(var i = 0; i < guardOpen.length; i++){
			
			if(guardOpen[i].f < guardOpen[winner].f){ // finding min F in the open list
				winner = i;
			}
		}

		current = guardOpen[winner];
		pri = current;
		
		if(current === end){
			
			guardPath = [];
			var temp = current;
			guardPath.push(temp);
			while(temp.previous){
				guardPath.push(temp.previous);
				temp = temp.previous;
			}
			indG = guardPath.length-1;
			break;
			noLoop();
			console.log("Done Guard");
		}

		removeFromArray(guardOpen, current); // function to remove current from openSet (need to make function since no other way to remove from array)
		guardClose.push(current); //add to closed set

		//iterating neighbors
		var neighbors = current.neighbors;
		for(var i = 0; i < neighbors.length; i++){
			var neighbor = neighbors[i];
			
			if(!guardClose.includes(neighbor) && !neighbor.wall){
				var tempG = current.g + 1; //adding 1 to G value to denote distance

				//check whether curr neighbor is already evaluated
				var newPath = false; // to check whether better path found or not
				if(guardOpen.includes(neighbor)){ //path already under consideration
					if(tempG < neighbor.g){ // better path found
						neighbor.g = tempG;
						newPath = true;
					}
				}
				else{
					neighbor.g = tempG; //not yet considered
					newPath = true;
					guardOpen.push(neighbor);
				}

				if(newPath){
					neighbor.h = heuristic(neighbor, end);	//finding h
					neighbor.f = neighbor.g + neighbor.h;	//finding f
					neighbor.previous = current;			//storing previous so that path can be iterated
				}
				
			}

		}

		
		if(currInd >0){
			 currInd--;
			 k = path[currInd];
			 end = grid[k.i][k.j];
		}
		
	}
	else{
		//No possible solution
		console.log("No solution");
		noLoop();
		return;
	}

    //Finding path after each itr ends
	guardPath = [];
	var temp = current;
	guardPath.push(temp);
	while(temp.previous){
		guardPath.push(temp.previous);
		temp = temp.previous;
	}
	}
}

function setup(){
    createCanvas(1024 ,1024);
    console.log('a*');


	 cols = 27;
	 rows = 27;
	 grid = new Array(rows);
	 openSet = [];
	 closedSet = [];
	 start;
	 end;
	 w;
	 h;
	 path = [];
	 blueprint;
	 level;
	 G;

	 target;
	 pacman;

	 n_guards = 2;
	 guards =[];
	 pact =[];

	 pac = [];
	 food = [];

	 ind =0;

	 guardPath = [];
	 indG;


    for(var i = 0; i < rows; i++){
    	grid[i] = new Array(cols);
    }

    

    //for aliging the blocks according to size of canvas
    w = width/cols;
    h = height/rows;

	//createCanvas(810,810);
	angleMode(DEGREES);
	rectMode(CENTER);
	imageMode(CENTER);

	level=new Level(1,1);
	blueprint=level.blueprint1;

	for(var i = 0; i< rows; i++){
    	for(var j = 0; j< cols; j++){
    		grid[i][j] = new Spot(i,j);
    		if(blueprint[j][i] == 'W')
    			grid[i][j].wall = true;

    	}
    }

	generateFood();
	generatePacman();
	generateGuards();

  	level.buildNewMap(level.blueprint1);

	//getting neighbors of all nodes
	for(var i = 0; i<cols; i++){
		for(var j = 0; j<rows; j++){
			grid[i][j].addNeighbors(grid);
		}
	}

	start =grid[pac[1]][pac[0]];
	end = grid[food[1]][food[0]];
	
	//maikng sure start and end are not walls
	start.wall = false;
	end.wall = false;

	// //pushing start in openlist
	openSet.push(start);

	console.log(start);
	console.log(end);
	AstarPacman();
	// console.log(path);
	AstarGuard();

	console.log(guardPath);

	 button = createButton('RESET');
  	button.position(400, 19);
	 button.mousePressed(changeBG);

	 slider = createSlider(0, 60, 1);
	slider.position(500, 19);
	
	
}

function changeBG() {
	 setup();
}

//it is function in P5 lib which contineously runs (loops) to make image
function draw(){

	let val = slider.value();
	 frameRate(val);
  
	
	  background(255);
    noStroke();
    level.drawMap(level.current_map);

	target.show(); 
	
    if(ind >=0){
	
    var pri = path[ind];
     var x = pri.i*level.cell_w + level.cell_w/2;
    var y = pri.j*level.cell_h + level.cell_h/2;
   	rect(x,y, level.cell_w, level.cell_h);
   	ind--;
   }

   if(ind <0){
   	 var pri = path[ind+1];
     var x = pri.i*level.cell_w + level.cell_w/2;
    var y = pri.j*level.cell_h + level.cell_h/2;
   	rect(x,y, level.cell_w, level.cell_h);
  
   }

   if(indG >=0){
	
    var pri = guardPath[indG];
     var x = pri.i*level.cell_w + level.cell_w/2;
    var y = pri.j*level.cell_h + level.cell_h/2;
    noStroke();
    fill(0,255,0);
   	rect(x,y, level.cell_w, level.cell_h);
   	indG--;
   }

   if(indG <0){
   	 var pri = guardPath[indG+1];
     var x = pri.i*level.cell_w + level.cell_w/2;
    var y = pri.j*level.cell_h + level.cell_h/2;
    noStroke();
    fill(0,255,0);
   	rect(x,y, level.cell_w, level.cell_h);

   }

}


