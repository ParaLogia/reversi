const readline = require("readline");
const Piece = require("./piece.js");
const Board = require("./board.js");
const Human = require("./human.js");
const Computer = require("./computer.js");

/**
 * Sets up the game with a board and the first player to play a turn.
 */
function Game () {
  this.board = new Board();
  this.turn = "black";
  this.player1 = new Computer();
  this.player2 = new Computer();
}

/**
 * Flips the current turn to the opposite color.
 */
Game.prototype._flipTurn = function () {
  this.turn = (this.turn == "black") ? "white" : "black";
};

// Dreaded global state!
let rlInterface;

/**
 * Creates a readline interface and starts the run loop.
 */
Game.prototype.play = function () {
  rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  this.runLoop(function () {
    rlInterface.close();
    rlInterface = null;
  });
};

Game.prototype.getPlayer = function () {
  if (this.turn === "black") {
    return this.player1;
  }
  else {
    return this.player2;
  }
};

/**
 * Gets the next move from the current player and
 * attempts to make the play.
 */
Game.prototype.playTurn = function (callback) {
  this.board.print();

  let player = this.getPlayer();
  player.makeMove(this, rlInterface, handleResponse);


  function handleResponse(pos) {
    if (!this.board.validMove(pos, this.turn)) {
      console.log("Invalid move!");
      this.playTurn(callback);
      return;
    }

    this.board.placePiece(pos, this.turn);
    this._flipTurn();
    callback();
  }
};

/**
 * Continues game play, switching turns, until the game is over.
 */
Game.prototype.runLoop = function (overCallback) {
  if (this.board.isOver()) {
    this.board.print();
    console.log("The game is over!");
    let results = this.board.results();
    console.log(`Final score - White: ${results.white} Black: ${results.black}`);
    overCallback();
  } else if (!this.board.hasMove(this.turn)) {
    console.log(`${this.turn} has no move!`);
    this._flipTurn();
    this.runLoop(overCallback);
  } else {
    this.playTurn(this.runLoop.bind(this, overCallback));
  }
};

module.exports = Game;
