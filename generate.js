
function generator(){
	var level;
	var blueprint;

	var target;
	var pacman;

	var n_guards = 2;
	var guards =[];

	var pac = [];
	var food = [];

	level=new Level(1,1);
  	blueprint=level.blueprint1;

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

	    var pact=[];
	    pact.push(x);
	    pact.push(y);

	    level.cell_w = Math.ceil(width / 27); 
	    level.cell_h = Math.ceil(height / 27);

	    guards.push(new Pellet(pact[1] * level.cell_w, pact[0] * level.cell_h, level.cell_w, level.cell_h,3));
	    x=Math.floor(random(0,27));
	    y=Math.floor(random(0,27));

	  }

	}

}