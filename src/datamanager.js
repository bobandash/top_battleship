import Ship from "./ship";

let player1;
let player2;
const carrier = new Ship(5, 'Carrier');
const battleship = new Ship(4, 'Battleship');
const cruiser = new Ship(3, 'Cruiser');
const submarine = new Ship(3, 'Submarine');
const destroyer = new Ship(2, 'Destroyer');
const allShips = [carrier, battleship, cruiser, submarine, destroyer];

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



export {setPlayer, getPlayer, allShips};