import HumanPlayer from "./human-player";
import AIPlayer from "./ai-player";
import {setPlayer} from './datamanager'


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

  function start(username){
    setPlayer(new HumanPlayer(username), 1);
    setPlayer(new AIPlayer, 2);
    if(!getIsPlayerOneTurn()){
      toggleTurn();
    }
  }


  return {toggleTurn, getIsPlayerOneTurn, isOver, start};
})();

export default Game;