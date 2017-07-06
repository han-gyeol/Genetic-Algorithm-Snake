let s;
let scale = 50;
let cols;
let rows;
let food;
let timeout;
let limit;
let timeTaken;

let popSize = 10;
let currentPopulation;
let population = [];
let fitness = [];
let playCount;
let sumFitness;
let gamesEachPopulation = 3;
let bestFitness;
let bestIdx;

function setup() {
  createCanvas(600, 600);
  initGUI();
  // noLoop();
  cols = floor(width/scale);
  rows = floor(height/scale);
  limit = cols*rows*10;
  // limit = 100;
  // frameRate(10);
  initPopulation();
  start();
}

function initGUI() {
  let button = document.createElement('button');
  document.body.appendChild(button);
}

function mousePressed() {
   redraw(1);
 }

function start() {
  currentPopulation = 0;
  bestFitness = Number.NEGATIVE_INFINITY;
  s = population[0];
  // s = new Snake(0, 0, 1, 0, 0, [], [-3, 0, 2, 0, 1]);
  s.birthtime = frameCount;
  pickFirstFoodLocation();
}

function endGeneration() {
  console.log("BEST FITNESS : " + bestFitness);
  console.log("BEST WEIGHTS : " + population[bestIdx].weights);
  console.log("GENERATING NEXT GENERATION...");
  nextGeneration();
  // for (let i = 0; i < popSize; i++) {
  //   console.log(population[i].weights);
  // }
  // console.log(fitness);
  currentPopulation = 0;
  s = population[currentPopulation];
}

function nextSnake() {
  if (bestFitness < fitness[currentPopulation]) {
    bestFitness = fitness[currentPopulation];
    bestIdx = currentPopulation;
  }

  currentPopulation++;
  if (currentPopulation === population.length) {
    endGeneration();
  }
  s = population[currentPopulation];
  s.birthtime = frameCount;
  pickFirstFoodLocation();
}

function playAgain() {
  s = new Snake(0, 0, 0, 0, 0, [], population[currentPopulation].weights, 0);
  s.birthtime = frameCount;
  pickFirstFoodLocation();
}

function initPopulation() {
  for (let i = 0; i < popSize; i++) {
    let weights = [random(-1, 0), random(-1, 0), random(-1, 1), random(-1, 0), random(-1, 0)];
    population.push(new Snake(0, 0, 0, 0, 0, [], weights, 0));
  }
  sumFitness = 0;
  playCount = 0;
}

function pickFirstFoodLocation() {
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scale);
  timeout = frameCount + limit;
}

function pickLocation() {
  let check = true;
  timeout = frameCount + limit;

  while(check) {
    check = false;
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scale);
    for (let i = 0; i < s.tail.length; i++) {
      if (food.x === s.tail[i].x && food.y === s.tail[i].y) {
        check = true;
        break;
      }
    }
    if (food.x === s.x && food.y === s.y) {
      check = true;
    }
  }
}

function draw() {
  background(51);

  if (s.eat(food)) {
    pickLocation();
  }
  // s.update();
  let noWhereToGo = false;
  noWhereToGo = s.makeMove(s.pickDir());
  s.show();

  fill(255, 0, 100);

  rect(food.x, food.y, scale, scale);

  if (s.death() || noWhereToGo === true) {
    // noLoop();
    let roundOver = false;
    // PLAY ROUNDS OVER
    if(playCount === gamesEachPopulation) {
      fitness[currentPopulation] = sumFitness / gamesEachPopulation;
      if (fitness[currentPopulation] < 0) fitness[currentPopulation] = 0;
      console.log("GAME OVER: " + currentPopulation);
      console.log("WEIGHTS: " + population[currentPopulation].weights);
      console.log("Fitness = " + fitness[currentPopulation]);
      sumFitness = 0;
      playCount = 0;

      roundOver = true;
    }
    // PLAY ROUNDS NOT OVER
    else {
      sumFitness += s.tail.length + (frameCount-s.birthtime)/(cols*rows*-1);
      playCount++;
    }

    // GENERATION OVER
    if (roundOver) {
      nextSnake();
    } else {
      playAgain();
    }
  } else if (s.end()) {
    console.log("GAME COMPLETE: " + currentPopulation);
    fitness[currentPopulation] = s.tail.length + (frameCount-s.birthtime)/(cols*rows*-0.5);
    console.log("Fitness = " + fitness[currentPopulation]);
    if (currentPopulation === population.length-1) {
      endGeneration();
    } else {
      nextSnake();
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}
