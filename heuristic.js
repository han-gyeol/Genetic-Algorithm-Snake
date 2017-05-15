function Heuristic(snake, weights) {
  this.snake = snake;
  this.fitness = 0;
  this.weights = [];

  const foodDistIdx = 0;
  const centerDistIdx = 1;
  const compactnessIdx = 0;

  this.weights[foodDistIdx] = weights[foodDistIdx];
  this.weights[centerDistIdx] = weights[centerDistIdx];
  this.weights[compactnessIdx] = weights[compactnessIdx];

  this.calculateFitness = function() {
    if(this.snake.death() === true) {
      return Number.NEGATIVE_INFINITY;
    }
    return this.weights[foodDistIdx] * this.foodDist(food)
          +this.weights[centerDistIdx] * this.centerDist()
          +this.weights[compactnessIdx] * this.compactness();
  }

  this.foodDist = function(food) {
    return dist(this.snake.x, this.snake.y, food.x, food.y);
  }

  this.centerDist = function() {
    return dist(this.snake.x, this.snake.y, width/2, height/2);
  }

  this.compactness = function() {
    let count = 0;
    for (let i = 0; i < this.snake.tail.length; i++) {
      for (let j = 0; j < this.snake.tail.length; j++) {
        if (this.snake.tail[i].x + scale === this.snake.tail[j].x && this.snake.tail[i].y === this.snake.tail[j].y) {
          count++;
        } else if (this.snake.tail[i].x - scale === this.snake.tail[j].x && this.snake.tail[i].y === this.snake.tail[j].y) {
          count++;
        } else if (this.snake.tail[i].x === this.snake.tail[j].x && this.snake.tail[i].y + scale === this.snake.tail[j].y) {
          count++;
        } else if (this.snake.tail[i].x === this.snake.tail[j].x && this.snake.tail[i].y - scale === this.snake.tail[j].y) {
          count++;
        }
      }
      if (this.snake.tail[i].x + scale === this.snake.x && this.snake.tail[i].y === this.snake.y) {
        count++;
      } else if (this.snake.tail[i].x - scale === this.snake.x && this.snake.tail[i].y === this.snake.y) {
        count++;
      } else if (this.snake.tail[i].x === this.snake.x && this.snake.tail[i].y + scale === this.snake.y) {
        count++;
      } else if (this.snake.tail[i].x === this.snake.x && this.snake.tail[i].y - scale === this.snake.y) {
        count++;
      }
    }

    for (let j = 0; j < this.snake.tail.length; j++) {
      if (this.snake.x + scale === this.snake.tail[j].x && this.snake.y === this.snake.tail[j].y) {
        count++;
      } else if (this.snake.x - scale === this.snake.tail[j].x && this.snake.y === this.snake.tail[j].y) {
        count++;
      } else if (this.snake.x === this.snake.tail[j].x && this.snake.y + scale === this.snake.tail[j].y) {
        count++;
      } else if (this.snake.x === this.snake.tail[j].x && this.snake.y - scale === this.snake.tail[j].y) {
        count++;
      }
    }
    return count/2;
  }

}
