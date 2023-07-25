
import Player from './player'
import SHIP_STATUS from '../utils/ship-status';
import Coordinates from '../utils/coordinates';

export default class AIPlayer extends Player {
  constructor(name = 'Enemy'){
    super(name);
  }
  
 static attack({opponent}){
    for(;;){
      const randomX = Math.round(Math.random(0,1) * 9) + 1;
      const randomY =  Math.round(Math.random(0,1) * 9) + 1;
      const coordinateToAttack = new Coordinates(randomX, randomY);
      const coordinateToAttackStringified = coordinateToAttack.toString();
      if(!(opponent.gameboard.get(coordinateToAttackStringified) === SHIP_STATUS.HIT || opponent.gameboard.get(coordinateToAttackStringified) === SHIP_STATUS.MISSED)){
        opponent.gameboard.receiveAttack(coordinateToAttack);
        break;
      }
    }
  }

}