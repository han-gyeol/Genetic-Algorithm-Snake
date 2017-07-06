let mutationRate = 0.05;
let survivalRate = 0.5;
let numWeights = 5;

function nextGeneration() {
  sortPopulation();
  crossover();
  mutate();
  sortPopulation();
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
    let CDF = [];
    CDF[0] = fitness[0];
    for (let j = 1; j < population.length; j++) {
      CDF[j] = CDF[j-1] + fitness[j];
    }
    let top = CDF[population.length-1];
    let pickA = random(0, top);
    let pickB = random(0, top);
    let parentA;
    let parentB;
    for (let j = 0; j < population.length; j++) {
      if (pickA <= CDF[j]) {
        parentA = j;
        break;
      }
    }
    for (let j = 0; j < population.length; j++) {
      if (pickB <= CDF[j]) {
        parentB = j;
        break;
      }
    }
    let newWeights = [];
    let norm = fitness[parentA] + fitness[parentB];
    if (norm === 0) continue;
    for (let j = 0; j < numWeights; j++) {
      let weight = population[parentA].weights[j]*(fitness[parentA]/norm) + population[parentB].weights[j]*(fitness[parentB]/norm);
      newWeights.push(weight);
    }
    let child = new Snake(0, 0, 0, 0, 0, [], newWeights);
    population[population.length-i-1] = child;
    console.log("crossover: " + child.weights);
  }
}

function mutate() {
  for (let i = 0; i < population.length; i++) {
    for (let j = 0; j < numWeights; j++) {
      if (random(1) < mutationRate) {
        population[i].weights[j] *= (1 + (1 - i/population.length));
        population[i].weights[j] += random(-0.2, 0.2);
        console.log("mutate: " + population[i].weights);
      }
    }
  }
}
