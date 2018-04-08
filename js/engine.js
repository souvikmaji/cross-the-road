var Engine = (function(global) {
  var doc = global.document;
  var win = global.window;
  var canvas = doc.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  var lastTime;

  var tiles = (function() {
    var block = {
      height: 83,
      width: 101
    };
    var map = [
      [0, 0, 0, 0, 0], // water
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1], // stone
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2] // grass
    ];
    var images = [
      "images/water-block.png", // :0
      "images/stone-block.png", // :1
      "images/grass-block.png" // :2
    ];

    return {
      //get number of rows and cols in tile
      numRows: function() {
        return map.length;
      },
      numCols: function() {
        return map[0].length;
      },

      //get details of individual tile blocks
      getBlockWidth: function() {
        return block.width;
      },
      getBlockHeight: function() {
        return block.height;
      },

      getImage: function(imageIndex) {
        return images[imageIndex];
      },

      //get block type [0: water, 1: stone, 2: grass]
      getType: function(x, y) {
        return map[x][y];
      },

      //get block number in row-major order
      getBlock: function(x, y) {
        var col = Math.floor(x / block.width);
        var row = Math.floor(y / block.height) + 1;
        return col + row * this.numCols();
      }
    };
  })();

  canvas.width = tiles.numCols() * tiles.getBlockWidth();
  canvas.height = (tiles.numRows() + 1) * tiles.getBlockHeight();

  /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
  function main() {
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;
    update(dt);
    render();
    lastTime = now;
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  function update(dt) {
    updateEntities(dt);
  }

  function updateEntities(dt) {
    allEnemies.forEach(function(enemy, index) {
      enemy.update(dt, index);
      enemy.checkCollisions();
    });
    player.update();
  }

  /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
  function render() {
    var row, col;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (row = 0; row < tiles.numRows(); row++) {
      for (col = 0; col < tiles.numCols(); col++) {
        /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */

        ctx.drawImage(
          Resources.get(tiles.getImage(tiles.getType(row, col))),
          col * tiles.getBlockWidth(),
          row * tiles.getBlockHeight()
        );
      }
    }

    renderEntities();
  }

  /* This function is called by the render function and is called on each game
     * tick. It then call the render functions on enemy and player entities
     */
  function renderEntities() {
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });
    player.render();
  }

  /* game reset states - new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
  function reset() {
    // noop
  }

  /* Load all of the images needed to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start. Replace with
     * readAll('/images') when all images are used.
     */
  Resources.load([
    "images/stone-block.png",
    "images/water-block.png",
    "images/grass-block.png",
    "images/enemy-bug.png",
    "images/char-boy.png"
  ]);
  Resources.onReady(init);

  global.ctx = ctx;
  global.ctx.tiles = tiles;
})(this);
