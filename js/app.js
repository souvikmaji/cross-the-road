var tiles = ctx.tiles;

// returns a pseudorandom number between min and max(inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * Math.floor(max)) + Math.floor(min);
}

// Enemies our player must avoid
var Enemy = function() {
  this.sprite = "images/enemy-bug.png";

  this.x = this.getInitialX();
  this.y = this.getInitialY();
  this.velocity = getRandomInt(100, 500);
};

Enemy.prototype.getInitialX = function() {
  return -tiles.getBlockWidth() / 4;
};

Enemy.prototype.getInitialY = function() {
  var blockHeight = tiles.getBlockHeight();
  return blockHeight * getRandomInt(1, tiles.numRows() - 2) - blockHeight / 4;
};

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, index) {
  this.x += this.velocity * dt;
  //remove enemy if canvas boundary crossed
  if (this.x > ctx.canvas.width - tiles.getBlockWidth() / 8) {
    allEnemies.splice(index, 1);
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkCollisions = function() {
  var currentBlock = tiles.getBlock(this.x, this.y);
  if (currentBlock === player.getBlock()) {
    player.manageCollision();
  }
};

var allEnemies = [new Enemy()];

var manageEnemies = function() {
  var chanceOfCreatingEnemy = getRandomInt(0, 2);
  if (chanceOfCreatingEnemy === 1) {
    allEnemies.push(new Enemy());
  }
};

setInterval(manageEnemies, 250);

var player = (function() {
  var sprite = "images/char-boy.png";
  var score = 0;

  var getInitialX = function() {
    return tiles.getBlockHeight() * (tiles.numCols() - 2.5);
  };

  var getInitialY = function() {
    return tiles.getBlockWidth() * tiles.numRows() / 1.44;
  };

  var x = getInitialX();
  var y = getInitialY();

  return {
    getBlock: function() {
      return tiles.getBlock(x, y);
    },

    update: function() {
      document.getElementById("timer").innerHTML = timerVal;
      document.getElementById("score").innerHTML = score;
      if (y < tiles.getBlockHeight() / 2) {
        setTimeout(function() {
          x = getInitialX();
          y = getInitialY();
        }, 600);
      }
    },

    handleInput: function(keyPressed) {
      var blockHeight = tiles.getBlockHeight();
      var blockWidth = tiles.getBlockWidth();

      if (keyPressed === "up" && y > blockHeight / 2) {
        y -= blockHeight;
        if (y < blockHeight / 2) {
          score += 1;
        }
      }
      if (keyPressed === "down" && y < blockHeight * (tiles.numRows() - 2)) {
        y += blockHeight;
      }
      if (keyPressed === "left" && x > blockWidth / 2) {
        x -= blockWidth;
      }
      if (keyPressed === "right" && x < blockWidth * (tiles.numCols() - 1)) {
        x += blockWidth;
      }
    },

    reset: function() {
      x = getInitialX();
      y = getInitialY();
      score = 0;
    },

    render: function() {
      ctx.drawImage(Resources.get(sprite), x, y);
    },

    // manage player after collision
    manageCollision: function() {
      x = getInitialX();
      y = getInitialY();
    }
  };
})();

var timerVal = 30;
setInterval(function() {
  if (timerVal === 0) {
    timerVal = 30;
    allEnemies = [];
    player.reset();
  }
  timerVal -= 1;
}, 1000);

document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
