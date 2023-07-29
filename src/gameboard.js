import SHIP_STATUS from '../utils/ship-status';
import Coordinates from '../utils/coordinates';
import ORIENTATION from '../utils/orientation'
import {isHit, createHitStatus} from "./helper-functions"

export default class Gameboard {
  constructor(){
    const board = new Map();
    for(let i = 1; i <= 10; i+=1){
      for(let j = 1; j<= 10; j+=1){
        board.set(new Coordinates(i,j).toString(), SHIP_STATUS.EMPTY);
      }
    }
    this.board = board;
    this.ships_placed = [];
    this.ships_sunk = [];
  }
  

  /* helper functions for placing a ship */
  hasOtherShipAtLocationPlaced({ship, startingCoordinate, direction}){
    const startingCoordinateX = startingCoordinate.x;
    const startingCoordinateY = startingCoordinate.y;
    const shipLength = ship.length;

    for(let i = 0; i < shipLength; i+=1){
      const coordinateToCheckStringified = (direction === ORIENTATION.x ? new Coordinates(startingCoordinateX + i, startingCoordinateY).toString() : 
        new Coordinates(startingCoordinateX, startingCoordinateY - i).toString());
      
        if(this.board.get(coordinateToCheckStringified) !== SHIP_STATUS.EMPTY){
          return true;
        }
    }
    return false;
  }


  static isCoordinateValid({ship, startingCoordinate, direction}){
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
      endingCoordinateY = startingCoordinateY - shipLength + 1;     
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


  place({ship, startingCoordinate, direction = ORIENTATION.x}){
    if(!Gameboard.isCoordinateValid({ship, startingCoordinate, direction})){
      throw new Error('Coordinate is invalid');
    }

    if(this.hasOtherShipAtLocationPlaced({ship, startingCoordinate, direction})){
      throw new Error('Another ship is already placed at that coordinate');
    }

    const startingCoordinateX = startingCoordinate.x;
    const startingCoordinateY = startingCoordinate.y;
    const shipLength = ship.length;    

    for(let i = 0; i < shipLength; i+=1){
      const coordinateToAdd = (direction === ORIENTATION.x ? new Coordinates(startingCoordinateX + i, startingCoordinateY).toString() : 
        new Coordinates(startingCoordinateX, startingCoordinateY - i).toString());
      this.board.set(coordinateToAdd, ship.name);
    }
    this.ships_placed.push(ship);
  }

  receiveAttack(coordinate){
    const coordinateStringified = coordinate.toString();
    const positionValue = this.board.get(coordinateStringified);
    const shipName = positionValue;
    let shipIndex;
    if(isHit(positionValue) || positionValue === SHIP_STATUS.MISSED || positionValue === SHIP_STATUS.SUNK){
      throw new Error("Coordinate has already been attacked before");
    } else if (positionValue === SHIP_STATUS.EMPTY){
      this.board.set(coordinateStringified, SHIP_STATUS.MISSED);
    // CASE: there is a ship at the location
    } else {
      this.ships_placed.forEach((obj, index) => {
        if(obj.name === shipName){
          shipIndex = index;
        }
      })
      console.log(this.ships_placed[shipIndex]);
      this.ships_placed[shipIndex].hit();
      this.board.set(coordinateStringified, createHitStatus(shipName));
      if(this.ships_placed[shipIndex].isSunk()){
        this.ships_sunk.push(this.ships_placed[shipIndex]);
      }
    }
  }

  allShipsSunk(){
    if(this.ships_placed.length === this.ships_sunk.length){
      return true;
    }
    return false;
  }

}