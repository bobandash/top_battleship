const Game = (() => {
  let isPlayerOneTurn = true;

  function toggleTurn(){
    isPlayerOneTurn = !isPlayerOneTurn;
  }

  function getIsPlayerOneTurn(){
    return isPlayerOneTurn;
  }

  function isOver(player1, player2){
    if(player1.gameboard.allShipsSunk() || player2.gameboard.allShipsSunk()){
      return true;
    }
    return false;
  }

  return {toggleTurn, getIsPlayerOneTurn, isOver};
})();

export default Game;