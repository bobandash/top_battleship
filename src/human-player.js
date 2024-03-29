import Player from './player'
import SHIP_STATUS from '../utils/ship-status';

export default class HumanPlayer extends Player{
  static attack(opponent, coordinates){
    const coordinateToAttackStringified = coordinates.toString();
    if(!(opponent.gameboard.board.get(coordinateToAttackStringified) === SHIP_STATUS.HIT || opponent.gameboard.board.get(coordinateToAttackStringified) === SHIP_STATUS.MISSED)){
      opponent.gameboard.receiveAttack(coordinates);
    }
  }
}
