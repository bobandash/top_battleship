import Player from './player'

import SHIP_STATUS from '../utils/ship-status';

export default class HumanPlayer extends Player{
  constructor(name){
    super.constructor(name);
  }

  static attack({opponent, coordinates}){
    const coordinateToAttackStringified = coordinates.getString();
    if(!(opponent.gameboard.get(coordinateToAttackStringified) === SHIP_STATUS.HIT || opponent.gameboard.get(coordinateToAttackStringified) === SHIP_STATUS.MISSED)){
      opponent.gameboard.receiveAttack(coordinates);
    }
  }
}
