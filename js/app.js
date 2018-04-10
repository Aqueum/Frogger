// Global variables
// score is the score of the current game
var score = 0;
// froggerScore is the top score when stored locally so it survives browser sessions
if (!localStorage.getItem('froggerScore')) {
  localStorage.setItem('froggerScore', 0);
}
topScore = localStorage.getItem('froggerScore');
// a flag that goes true when we've just lost
var defeat = false;

// a superclass that gives the shared attributes of both Enemy and Player classes
var Actor = function(x, y) {
  // x & y are actor screen coordinates
  this.x = x;
  this.y = y;
};
// by using a prototype, we don't need a separate render function for each actor, as they all rendor the same way
Actor.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(x, y, v) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  Actor.call(this, -100, y);
  // v is basic velocity which varies per enemy
  this.v = v;
  this.sprite = 'images/char-horn-girl.png';
};
// Draw the enemy on the screen, required method for game
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  // including score lets they game accellarate per level
  this.x += this.v * dt * score;
  // loop the enemy to the start when it goes off-screen
  if (this.x > 550) {
    this.x = -100;
  }
  // defeat scenario - if the enemy and player are within a certain prximity
  if (
    Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)) <
    60
  ) {
    defeat = true;
    alert(
      'You got squished!  Score = ' +
        score +
        '  (top score ' +
        topScore +
        ')  try again...'
    );
    score = 0;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
  Actor.call(this, x, y);
  this.sprite = 'images/char-princess-girl.png';
};
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
  // this doesn't actually use dt - fail
  // win scenario
  if (this.y === 0) {
    score += 1;
    if (score > topScore) {
      topScore = score;
      localStorage.setItem('froggerScore', topScore);
    }
    alert('You made it!  Score = ' + score + '  (top score ' + topScore + ')');
    // send player back to the bottom
    this.y = 400;
  }
  if (defeat === true) {
    this.y = 400;
    defeat = false;
  }
};

Player.prototype.handleInput = function(key) {
  // move the player
  switch (key) {
    case 'up':
      this.y -= 20;
      break;
    case 'down':
      this.y += 20;
      break;
    case 'left':
      this.x -= 20;
      break;
    case 'right':
      this.x += 20;
      break;
    default:
      null;
  }
  // bound the player to the screen
  if (this.x > 410) {
    this.x -= 20;
  }
  if (this.x < 0) {
    this.x += 20;
  }
  if (this.y > 400) {
    this.y -= 20;
  }
  if (this.y < 0) {
    this.y += 20;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [
  (amy = new Enemy(-800, 75, 50)),
  (arthur = new Enemy(-200, 150, 30)),
  (ansel = new Enemy(-100, 225, 40))
];

var player = new Player(300, 300);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
