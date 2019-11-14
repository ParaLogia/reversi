function Computer () {

}

Computer.prototype.makeMove = function (game, interface, callback) {
  let moves = game.board.validMoves(game.turn);
  let best_moves = [];
  let most_flips = 0;

  moves.forEach((move) => {
    let flips = game.board.positionsToFlip(move, game.turn).length;
    if (flips > most_flips){
      most_flips = flips;
      best_moves = [move];
    } 
    else if (flips === most_flips) {
      best_moves.push(move);
    }
  });

  let index = Math.floor(Math.random() * best_moves.length);
  let best_move = best_moves[index];

  console.log(`Computer move: [${best_move}]`);
  callback.bind(game)(best_move);
};

module.exports = Computer;