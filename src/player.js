import Gameboard from './gameboard';
import Coordinates from '../utils/coordinates';
import SHIP_STATUS from '../utils/ship-status';

class Player {
  constructor(name){
    this._name = name;
    this._gameboard = new Gameboard();
  }
}

class HumanPlayer {
  constructor(name){
    super(name);
  }

  attack({opponent, coordinates}){
    if(!(opponent._gameboard.get(coordinateToAttackStringified) === SHIP_STATUS.HIT || opponent._gameboard.get(coordinateToAttackStringified) === SHIP_STATUS.MISSED)){
      opponent._gameboard.receiveAttack(coordinates);
    }
  }
}

class AIPlayer extends Player {
  constructor(name){
    super(name);
  }
  
  attack({opponent}){
    for(;;){
      const randomX = Math.round(Math.random(0,1) * 9) + 1;
      const randomY =  Math.round(Math.random(0,1) * 9) + 1;
      const coordinateToAttack = new Coordinates(randomX, randomY);
      const coordinateToAttackStringified = coordinateToAttack.toString();
      if(!(opponent._gameboard.get(coordinateToAttackStringified) === SHIP_STATUS.HIT || opponent._gameboard.get(coordinateToAttackStringified) === SHIP_STATUS.MISSED)){
        opponent._gameboard.receiveAttack(coordinates);
        break;
      }
    }
  }

}