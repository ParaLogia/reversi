function Human (){

}

Human.prototype.makeMove = function(game, interface, callback) {

  let parseCall = function(answer) {
    try {
      pos = JSON.parse(answer);
      callback.bind(game)(pos);
    }
    catch(error) {
      console.log('Invalid move!');
      this.makeMove(game, interface, callback);
    }
  };

  interface.question(
    `${game.turn}, where do you want to move?`,
    parseCall.bind(this)
  );
};

module.exports = Human;