let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];

  for(let i= 0; i < 8; i++){
    grid.push(Array(8).fill(undefined));
  }

  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  grid[4][3] = new Piece("black");
  grid[3][4] = new Piece("black");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let [x,y] = pos;
  if (!this.isValidPos(pos)) {
    throw Error("Not valid pos!");
  }
  return this.grid[x][y];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos);
  if (piece === undefined){
    return false;
  }

  return piece.color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let [x, y] = pos;
  return this.grid[x][y] !== undefined;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !(this.hasMove("white") || this.hasMove("black"));
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let [x, y] = pos;

  if (x < 0 || x >= 8 || y < 0 || y >= 8) {
    return false;
  }
  return true;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  let [x, y] = pos;
  let [dx, dy] = dir;
  let new_pos = [x + dx, y + dy];

  if (!board.isValidPos(new_pos)){
    return null;
  }

  let piece = board.getPiece(new_pos);

  if (piece === undefined){
    return null;
  }

  if (piece.color !== color){
    piecesToFlip.push(new_pos);
  }

  else {
    if (piecesToFlip.length > 0){
      return piecesToFlip;
    }
    else {
      return null;
    }
  }

  return _positionsToFlip(board, new_pos, color, dir, piecesToFlip);
}
  
Board.prototype.positionsToFlip = function (pos, color) {
  let flipPositions = [];

  Board.DIRS.forEach((dir) => {
    let positions = _positionsToFlip(this, pos, color, dir, []);
    if (positions !== null) {
      flipPositions = flipPositions.concat(positions);
    }
  });

  return flipPositions;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)){
    throw Error("Invalid Move");
  }
  let [x,y] = pos;
  this.grid[x][y] = new Piece(color);

  let flipPositions = this.positionsToFlip(pos, color);

  flipPositions.forEach((flipPos) => {
      this.getPiece(flipPos).flip();
  });
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log('  0 1 2 3 4 5 6 7');
  for (let y = 0; y < 8; y++) {
    let row = `${y} `;
    for (let x = 0; x < 8; x++) {
      piece = this.grid[x][y]
      if (piece === undefined){
        piece = '_';
      }
      row += piece.toString() + " ";
    }
    console.log(row);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (!this.isValidPos(pos)) {
    return false;
  }
  if (this.isOccupied(pos)) {
    return false;
  }
  return Board.DIRS.some((dir) => {
    if (_positionsToFlip(this, pos, color, dir, [])) {
      return true;
    }
  });
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let moves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.validMove([i, j], color)) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
};

Board.prototype.results = function () {
  let whiteCt = 0;
  let blackCt = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.grid[i][j] === undefined) {
        
      } 
      else if (this.grid[i][j].color === 'white') {
        whiteCt += 1;
      } 
      else {
        blackCt += 1;
      }
    }
  }
  return {
    white: whiteCt,
    black: blackCt
  };
};

module.exports = Board;
