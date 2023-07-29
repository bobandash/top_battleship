import PubSub from "pubsub-js";
import ORIENTATION from "../../utils/orientation";
import Coordinates from "../../utils/coordinates";
import SHIP_STATUS from "../../utils/ship-status";
import { removeBodyChildren } from "./helper"
import { getPlayer, allShipsPlayer1, allShipsPlayer2} from '../datamanager'
import AIPlayer from "../ai-player";


const placeShipScreen = (() => {
  function createPlaceShipDOM() {
    const body = document.querySelector('body');
    body.removeAttribute('class');
    body.classList.add('place-ships-screen');
    body.innerHTML = `
    <div class = "container">
      <div class="status"><h1></h1></div>
      <div class = "grid-and-buttons-container">
        <div class ="ships-grid">

        </div>
        <div class = "grid-buttons">
          <button id = "current-orientation" data-orientation = "${ORIENTATION.x}">Toggle Direction: ${ORIENTATION.x}</button>
        </div>
      </div>
      <div>
        <button id = "start-battle" class = "next-screen-button hidden">Start Battle</button> 
      </div>
    </div>
    `
    const grid = document.querySelector('.ships-grid');
    for(let i = 10; i >= 1; i-=1){
      for(let j = 1; j <= 10; j+=1){
        const coordinateElement = document.createElement('div');
        coordinateElement.setAttribute('data-y', i);
        coordinateElement.setAttribute('data-x', j);
        
        if(j === 10){
          coordinateElement.classList.add('grid-right-border');
        } else if (j === 1){
          coordinateElement.classList.add('grid-left-border');
        }

        if(i === 10){
          coordinateElement.classList.add('grid-top-border');
        } else if (i === 1){
          coordinateElement.classList.add('grid-bottom-border');
        }
        grid.appendChild(coordinateElement);
      }
    }
  }

  function addToggleOrientationButtonFunctionality(){
    const orientationBtn = document.getElementById('current-orientation');
    orientationBtn.addEventListener('click', () => {
      const currentOrientation = orientationBtn.getAttribute('data-orientation');
      if(currentOrientation === ORIENTATION.x){
        orientationBtn.setAttribute('data-orientation', ORIENTATION.y);
        orientationBtn.innerText = `Toggle Direction: ${ORIENTATION.y}`;
      } else {
        orientationBtn.setAttribute('data-orientation', ORIENTATION.x);
        orientationBtn.innerText = `Toggle Direction: ${ORIENTATION.x}`;
      }
    })
  }

  function addShipsToGridDOM(player){
    const allShipTiles = Array.from(document.querySelectorAll('.ships-grid > div > svg'));
    allShipTiles.forEach(shipTile => {
      shipTile.remove();
    })
    for(let i = 1; i <= 10; i+=1){
      for(let j = 1; j <= 10; j+=1){
        const coordinateToCheck = new Coordinates(i, j);
        if(player.gameboard.board.get(coordinateToCheck.toString()) !== SHIP_STATUS.EMPTY){
          const gridElement = document.querySelector(`[data-x='${i}'][data-y='${j}']`);
          const circleIcon = document.createElement('i');
          circleIcon.classList.add('fa-solid','fa-circle');
          gridElement.appendChild(circleIcon);
        }
      }
    }
  }

  
  function addStartBattleButton(){
    const startGameBtn = document.getElementById('start-battle');
    startGameBtn.classList.remove('hidden');
    startGameBtn.addEventListener('click', () => {
      PubSub.publish('Start Battling');
    })
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter'){
        PubSub.publish('Start Battling');
      }
    })
  }
  
  function renderPlaceStatusMessage(player, currentShip){
    const statusMessage = document.querySelector('.status > h1');
    if(currentShip === null) {
      statusMessage.innerText = `${player.name}, PREPARE FOR BATTLE!`;
      // TO-DO: add the double click functionality
      addStartBattleButton();
    }
    else {
      statusMessage.innerText = `${player.name}, Place Your ${currentShip.name} (${currentShip.length} Tiles)`
    }
  }

  function addPlaceShipFunctionality(player, playerNum){
    const allGridButtons = Array.from(document.querySelectorAll('.ships-grid > div'));
    const orientationButton = document.getElementById('current-orientation')
    let currentShipIndex = 0;
    const allShips = playerNum === 1 ? allShipsPlayer1 : allShipsPlayer2;
    let currentShip = allShips[currentShipIndex];
    renderPlaceStatusMessage(player, currentShip);
    allGridButtons.forEach(gridButton => {

      gridButton.addEventListener('click', () => {
        const rowNumber = parseInt(gridButton.getAttribute('data-x'), 10);
        const colNumber = parseInt(gridButton.getAttribute('data-y'), 10);
        const gridCoordinate = new Coordinates(rowNumber, colNumber);
        const orientation = orientationButton.getAttribute('data-orientation');

        // CASE: done placing ships, can double click to change orientation of ships
        if(currentShipIndex > (allShips.length - 1)){
          // TO-DO
        }
        else if(!player.gameboard.hasOtherShipAtLocationPlaced({
          ship: currentShip,
          startingCoordinate: gridCoordinate,
          direction: orientation
        })){
          player.gameboard.place ({
            ship: currentShip,
            startingCoordinate: gridCoordinate,
            direction: orientation          
          })
          currentShipIndex += 1;
          if(currentShipIndex > (allShips.length - 1)){
            currentShip = null;
          } else {
            currentShip = allShips[currentShipIndex];
          }
          addShipsToGridDOM(player);
          renderPlaceStatusMessage(player, currentShip);
        }

      })
    })
  }

  function addRandomCoordinateShips(player, playerNum){
    let currentShipIndex = 0;
    const allShips = playerNum === 1 ? allShipsPlayer1 : allShipsPlayer2;
    while (currentShipIndex < allShips.length){
        const randomX = Math.floor(Math.random() * 10) + 1;
        const randomY = Math.floor(Math.random() * 10) + 1;
        const randomCoordinate = new Coordinates(randomX, randomY);
        const randomOrientation = Math.random() < 0.5 ? ORIENTATION.x : ORIENTATION.y;
        const currentShip = allShips[currentShipIndex];
        if(!player.gameboard.hasOtherShipAtLocationPlaced({
          ship: currentShip,
          startingCoordinate: randomCoordinate,
          direction: randomOrientation
        })){
          player.gameboard.place ({
            ship: currentShip,
            startingCoordinate: randomCoordinate,
            direction: randomOrientation          
          })
          currentShipIndex += 1;
        }
    }
  }


  // TO-DO: accepts player 2 if not AI in the future
  function render(){
    removeBodyChildren();
    createPlaceShipDOM();
    addToggleOrientationButtonFunctionality();
    addPlaceShipFunctionality(getPlayer(1), 1);
    const player2 = getPlayer(2);
    if(player2 instanceof AIPlayer){
      addRandomCoordinateShips(player2, 2);
    } else {
      createPlaceShipDOM();
      addToggleOrientationButtonFunctionality();
      addPlaceShipFunctionality(getPlayer(2), 2);     
    }
  }

  return {render};
})();

export default placeShipScreen;