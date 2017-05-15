let s;
let scale = 20;
let cols;
let rows;
let food;
let timeout;

let popSize = 10;
let currentPopulation;
let population = [];
let fitness = [];
let bestFitness;
let bestIdx;

function setup() {
  createCanvas(600, 600);
  cols = floor(width/scale);
  rows = floor(height/scale);
  // frameRate(5);
  initPopulation();
  start();
}

function start() {
  currentPopulation = 0;
  bestFitness = Number.NEGATIVE_INFINITY;
  s = new Snake(0, 0, 1, 0, 0, [], population[currentPopulation].weights);
  pickFirstFoodLocation();
}

function initPopulation() {
  for (let i = 0; i < popSize; i++) {
    let weights = [random(-1, 1), random(-1, 1), random(-1, 1)];
    population.push(new Snake(0, 0, 1, 0, 0, [], weights));
  }
}

function pickFirstFoodLocation() {
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scale);
  timeout = frameCount + cols*rows;
  // timeout = frameCount + 20;
}

function pickLocation() {
  let check = true;
  timeout = frameCount + cols*rows;
  // timeout = frameCount + 20;

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

  if(currentPopulation === population.length) {
    console.log("BEST FITNESS : " + bestFitness);
    console.log("BEST WEIGHTS : " + population[bestIdx].weights);
    console.log("GENERATING NEXT GENERATION...");
    nextGeneration();
    currentPopulation = 0;
    s = population[currentPopulation];
  }

  if(s.eat(food)) {
    pickLocation();
  }
  // s.update();
  s.makeMove(s.pickDir());
  s.show();

  fill(255, 0, 100);

  rect(food.x, food.y, scale, scale);

  if (s.death()) {
    console.log("GAME OVER: " + currentPopulation);
    console.log("LENGTH: " + s.tail.length);
    fitness[currentPopulation] = s.tail.length + frameCount/(cols*rows*-1)
    console.log("Fitness = " + fitness[currentPopulation]);
    if (bestFitness < fitness[currentPopulation]) {
      bestFitness = fitness[currentPopulation];
      bestIdx = currentPopulation;
    }

    currentPopulation++;
    s = population[currentPopulation];
    pickFirstFoodLocation();
  } else if (s.end()) {
    console.log("GAME COMPLETE: " + currentPopulation);
    fitness[currentPopulation] = s.tail.length + frameCount/(cols*rows*-1)
    console.log("Fitness = " + fitness[currentPopulation]);
    if (bestFitness < fitness[currentPopulation]) {
      bestFitness = fitness[currentPopulation];
      bestIdx = currentPopulation;
    }

    currentPopulation++;
    s = population[currentPopulation];
    pickFirstFoodLocation();
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
