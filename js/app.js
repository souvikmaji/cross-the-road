var block = ctx.block;
var tiles = ctx.tiles;

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
  return 0;
};

Enemy.prototype.getInitialY = function() {
  return block.height * getRandomInt(1, 3) - block.height / 4;
};

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, index) {
  this.x += this.velocity * dt;
  //remove enemy if canvas boundary crossed
  if (this.x > block.width * (tiles.numCols + 1)) {
    allEnemies.splice(index, 1);
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.getVelocity = function() {
  return this.velocity;
};

Enemy.prototype.checkCollisions = function() {
  var currentBlock = tiles.getBlock(this.x, this.y);
  var currentPlayerBlock = tiles.getBlock(player.getX(), player.getY());
  if (currentBlock === currentPlayerBlock) {
    player.manageCollision();
  }
};

var player = (function() {
  sprite = "images/char-boy.png";

  var getInitialX = function() {
    return block.height * (tiles.numCols - 2.5);
  };
  var getInitialY = function() {
    return block.width * tiles.numRows / 1.6;
  };
  var x = getInitialX(),
    y = getInitialY();
  return {
    getX: function() {
      return x;
    },
    getY: function() {
      return y;
    },
    update: function() {
      tiles.getBlock(x, y);
      if (y < block.height / 2) {
        setTimeout(function() {
          y = getInitialY();
        }, 600);
      }
    },
    handleInput: function(keyPressed) {
      if (keyPressed === "up" && y > block.height / 2) {
        y -= block.height;
      }
      if (keyPressed === "down" && y < block.height * (tiles.numRows - 2)) {
        y += block.height;
      }
      if (keyPressed === "left" && x > block.width / 2) {
        x -= block.width;
      }
      if (keyPressed === "right" && x < block.width * (tiles.numCols - 1)) {
        x += block.width;
      }
    },
    render: function() {
      ctx.drawImage(Resources.get(sprite), x, y);
    },
    manageCollision: function() {
      x = getInitialX();
      y = getInitialY();
    }
  };
})();

allEnemies = [new Enemy()];

var manageEnemies = function() {
  var chanceOfCreatingEnemy = getRandomInt(0, 2);
  if (chanceOfCreatingEnemy === 1) {
    allEnemies.push(new Enemy());
  }
};

setInterval(manageEnemies, 500);

document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
