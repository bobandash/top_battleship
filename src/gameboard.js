import SHIP_STATUS from '../utils/ship-status';
import Coordinates from '../utils/coordinates';
import ORIENTATION from '../utils/orientation'

export default class Gameboard {
  constructor(){
    const board = new Map();
    for(let i = 1; i <= 10; i+=1){
      for(let j = 1; j<= 10; j+=1){
        board.set(new Coordinates(i,j).toString(), SHIP_STATUS.EMPTY);
      }
    }
    this._board = board;
    this._ships_placed = [];
    this._ships_sunk = [];
  }
  

  /* helper functions for placing a ship */
  hasOtherShipAtLocationPlaced({ship, startingCoordinate, direction}){
    const startingCoordinateX = startingCoordinate.x;
    const startingCoordinateY = startingCoordinate.y;
    const shipLength = ship.length;

    for(let i = 0; i < shipLength; i+=1){
      const coordinateToCheckStringified = (direction === ORIENTATION.x ? new Coordinates(startingCoordinateX + i, startingCoordinateY).toString() : 
        new Coordinates(startingCoordinateX, startingCoordinateY + i).toString());
      
        if(this._board.get(coordinateToCheckStringified) !== SHIP_STATUS.EMPTY){
          return true;
        }
    }
    return false;
  }


  isCoordinateValid({ship, startingCoordinate, direction}){
    const startingCoordinateX = startingCoordinate.x;
    const startingCoordinateY = startingCoordinate.y;
    const shipLength = ship.length;
    let endingCoordinateX;
    let endingCoordinateY;
    if(direction === ORIENTATION.x){
      endingCoordinateX = startingCoordinateX + shipLength - 1;
      endingCoordinateY = startingCoordinateY;
    } else {
      endingCoordinateX = startingCoordinateX;
      endingCoordinateY = startingCoordinateY + shipLength - 1;     
    }

    if(startingCoordinateX <= 0 || startingCoordinateX > 10 || endingCoordinateX <= 0 || endingCoordinateX > 10){
      return false;
    }
    if(startingCoordinateY <= 0 || startingCoordinateY > 10 || endingCoordinateY <= 0 || endingCoordinateY > 10){
      return false;
    }

    return true;
  }
  /* end helper functions for placing a ship */


  place({ship, startingCoordinate, direction = ORIENTATION.y}){
    if(!this.isCoordinateValid({ship, startingCoordinate, direction})){
      throw new Error('Coordinate is invalid');
    }

    if(this.hasOtherShipAtLocationPlaced({ship, startingCoordinate, direction})){
      throw new Error('Another ship is already placed at that coordinate');
    }

    const startingCoordinateX = startingCoordinate.x;
    const startingCoordinateY = startingCoordinate.y;
    const shipLength = ship.length;    
    const shipID = this._ships_placed.length;
    ship.id = shipID;

    for(let i = 0; i < shipLength; i+=1){
      const coordinateToAdd = (direction === ORIENTATION.x ? new Coordinates(startingCoordinateX + i, startingCoordinateY).toString() : 
        new Coordinates(startingCoordinateX, startingCoordinateY + i).toString());
      this._board.set(coordinateToAdd, ship.id);
    }
    this._ships_placed.push(ship);
  }

  receiveAttack(coordinate){
    const coordinateStringified = coordinate.toString();
    const positionValue = this._board.get(coordinateStringified);
    switch(positionValue){
      case SHIP_STATUS.HIT:
      case SHIP_STATUS.MISSED:
        throw new Error("Coordinate has already been attacked before");
        break;
      case SHIP_STATUS.EMPTY:
        this._board.set(coordinateStringified, SHIP_STATUS.MISSED);
        break;
      //There's a ship at this location
      default:
        const shipID = positionValue;
        this._ships_placed[shipID].hit();
        this._board.set(coordinateStringified, SHIP_STATUS.HIT);
        if(this._ships_placed[shipID].isSunk()){
          this._ships_sunk.push(this._ships_placed[shipID]);
        }
    }
  }

  allShipsSunk(){
    if(this._ships_placed.length === this._ships_sunk.length){
      return true;
    }
    return false;
  }

}