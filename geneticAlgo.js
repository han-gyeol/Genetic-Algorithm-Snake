let mutationRate = 0.01;
let survivalRate = 0.7;
let numWeights = 3;

function nextGeneration() {
  sortPopulation();
  crossover();
  mutate();
}

function sortPopulation() {
  for (let i = 1; i < population.length; i++) {
    let temp = population[i];
    let key = fitness[i];
    let j = i-1;
    while (j >= 0 && fitness[j] < key)
    {
      population[j+1] = population[j];
      fitness[j+1] = fitness[j];
      j = j-1;
    }
    population[j+1] = temp;
    fitness[j+1] = key;
  }
}

function crossover() {
  for (let i = 0; i < floor(population.length*(1 - survivalRate)); i++) {
    let parentA = floor(random(0, population.length*survivalRate));
    let parentB = floor(random(0, population.length*survivalRate));
    // console.log("Crossing : " + parentA + " with " + parentB);
    let newWeights = [];
    let norm = sqrt(fitness[parentA]*fitness[parentA] + fitness[parentB]*fitness[parentB]);
    for (let j = 0; j < numWeights; j++) {
      let weight = population[parentA].weights[j]*(fitness[parentA]/norm) + population[parentB].weights[j]*(fitness[parentB]/norm);
      newWeights.push(weight);
    }
    let child = new Snake(0, 0, 1, 0, 0, [], newWeights);
    population[population.length-i] = child;
  }
}

function mutate() {
  for (let i = 0; i < population.length; i++) {
    for (let j = 0; j < numWeights; j++) {
      if (random(1) < mutationRate) {
        population[i].heuristic.weights[j] = random(-1, 1);
      }
    }
  }
}
