import Ship from "./ship";

let player1;
let player2;
const carrier1 = new Ship(5, 'Carrier');
const battleship1 = new Ship(4, 'Battleship');
const cruiser1 = new Ship(3, 'Cruiser');
const submarine1 = new Ship(3, 'Submarine');
const destroyer1 = new Ship(2, 'Destroyer');

const carrier2 = new Ship(5, 'Carrier');
const battleship2 = new Ship(4, 'Battleship');
const cruiser2 = new Ship(3, 'Cruiser');
const submarine2 = new Ship(3, 'Submarine');
const destroyer2 = new Ship(2, 'Destroyer');

const allShipsPlayer1 = [carrier1, battleship1, cruiser1, submarine1, destroyer1];
const allShipsPlayer2 = [carrier2, battleship2, cruiser2, submarine2, destroyer2];

function setPlayer(newPlayer, playerNum){
  if(playerNum === 1){
    player1 = newPlayer;
  } else {
    player2 = newPlayer;
  }
}

function getPlayer(playerNum){
  if(playerNum === 1){
    return player1;
  }
  return player2;
}



export {setPlayer, getPlayer, allShipsPlayer1, allShipsPlayer2};