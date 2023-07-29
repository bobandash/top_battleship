import HumanPlayer from "./human-player";
import { getPlayer , setPlayer, allShipsPlayer1, allShipsPlayer2} from "./datamanager";
import AIPlayer from "./ai-player";
import Coordinates from "../utils/coordinates";
import SHIP_STATUS from "../utils/ship-status";
import ORIENTATION from "../utils/orientation";
import {isHit, getShipFromHitStatus, createHitStatus, getXFromStringifiedCoordinate, getYFromStringifiedCoordinate} from "./helper-functions"
import Game from './game'


const ui = (() => {
  function removeBodyChildren(){
    const bodyElement = document.querySelector('body');
    while(bodyElement.lastChild){
      bodyElement.removeChild(bodyElement.lastChild);
    }
  }
  

  function toggleNewGameButtonVisibility(){
    const newGameButton = document.getElementById('new-game');
    newGameButton.classList.toggle('hidden');
    addNewGameButtonFunctionality();
  }
  


function getMissIconDOM(){
  const blackCircle = document.createElement('i');
  blackCircle.classList.add('gray','fa-solid','fa-circle');
  return blackCircle;
}

function getHitIconDOM(){
  const redCircle = document.createElement('i');
  redCircle.classList.add('red','fa-solid','fa-circle');
  return redCircle;
}

function getSunkIconDOM(){
  const sunkIcon = document.createElement('i');
  sunkIcon.classList.add('red','fa-solid','fa-xmark');
  return sunkIcon;
}

// Replaces the DOM and replaces the grid status to sunk
function replaceHitWithSunkDOM(enemy, enemyPlayerNum, shipSunk){
  const filteredMapWithSpecificShipHit = new Map([...enemy.gameboard.board].filter(([k, v]) => v === createHitStatus(shipSunk)));
  Array.from(filteredMapWithSpecificShipHit.keys()).forEach((key) => {
    const coordinate = key;
    const x = parseInt(getXFromStringifiedCoordinate(coordinate), 10);
    const y = parseInt(getYFromStringifiedCoordinate(coordinate), 10);
    const gridCoordinateDOM = enemyPlayerNum === 2 ? document.querySelector(`#enemy-grid div[data-x='${x}'][data-y='${y}']`) : 
      document.querySelector(`#player-grid div[data-x='${x}'][data-y='${y}']`);
    while(gridCoordinateDOM.firstChild !== null){
      gridCoordinateDOM.firstChild.remove();
    }
    gridCoordinateDOM.appendChild(getSunkIconDOM());
  }) 
}

// AI Player is always player 2
function AIAttackDOM(){
  const hitIcon = getHitIconDOM();
  const missIcon = getMissIconDOM();
  const player = getPlayer(2);
  const enemy = getPlayer(1);
  const statusMessage = document.querySelector('.status > h1')

  if(!(Game.getIsPlayerOneTurn() || Game.isOver(player, enemy))){
    const numberShipsSunkBefore = enemy.gameboard.ships_sunk.length;
    const AIPlayerAttackedCoordinate = AIPlayer.attack(enemy);
    const AiPlayerGridAttackedDOM = document.querySelector(`#player-grid div[data-x='${AIPlayerAttackedCoordinate.x}'][data-y='${AIPlayerAttackedCoordinate.y}']`);
    const gridStatus = enemy.gameboard.board.get(AIPlayerAttackedCoordinate.toString()) 
    if(gridStatus === SHIP_STATUS.MISSED){
      AiPlayerGridAttackedDOM.appendChild(missIcon);
      statusMessage.innerText = 'AI Player missed their attack.';
    } else if(isHit(gridStatus)){
      const numberShipsSunkAfter = enemy.gameboard.ships_sunk.length;
      // in case one of the ships have been sunk
      if(numberShipsSunkAfter > numberShipsSunkBefore) {
        const shipSunk = enemy.gameboard.ships_sunk[numberShipsSunkAfter - 1].name;
        replaceHitWithSunkDOM(enemy, 1, shipSunk);
        statusMessage.innerText = `AI Player has sunk the your ${shipSunk}.`;
        if(Game.isOver(enemy, player)){
          statusMessage.innerText = `AI Player has won. GG!`
          toggleNewGameButtonVisibility();
        }
      } else {
        while(AiPlayerGridAttackedDOM.firstChild !== null){
          AiPlayerGridAttackedDOM.firstChild.remove();
        }
        AiPlayerGridAttackedDOM.appendChild(hitIcon);
        statusMessage.innerText = `AI Player's attack has landed.`;
      }
    }
    Game.toggleTurn();
  }
}

function addEnemyWaterClickFunctionality(){
  // enemy grids refers to player 2's grid
  const enemyGrids = Array.from(document.querySelectorAll('#enemy-grid > div'));
  const player = getPlayer(1);
  const enemy = getPlayer(2);
  const statusMessage = document.querySelector('.status > h1')
  const hitIcon = getHitIconDOM();
  const missIcon = getMissIconDOM();


  enemyGrids.forEach(grid => {
    grid.addEventListener('click', () => {
      if(Game.getIsPlayerOneTurn() && !Game.isOver(player, enemy)){
          const elementInsideGrid = grid.firstChild;
          const numberShipsSunkBefore = enemy.gameboard.ships_sunk.length;
          if(elementInsideGrid === null){
            const x = parseInt(grid.getAttribute('data-x'), 10);
            const y = parseInt(grid.getAttribute('data-y'), 10);
            const coordinateToAttack = new Coordinates(x, y);
            HumanPlayer.attack(enemy, coordinateToAttack);
            const coordinateStatus = enemy.gameboard.board.get(coordinateToAttack.toString());
            if(isHit(coordinateStatus)){
              const numberShipsSunkAfter = enemy.gameboard.ships_sunk.length;
              // TO-DO: add application logic that changes the circles into Xs if the ships are sunk
              if(numberShipsSunkAfter > numberShipsSunkBefore) {
                const shipSunk = enemy.gameboard.ships_sunk[numberShipsSunkAfter - 1].name;
                replaceHitWithSunkDOM(enemy, 2, shipSunk);
                statusMessage.innerText = `You have sunk the enemy's ${shipSunk}`;
                if(Game.isOver(player, enemy)){
                  statusMessage.innerText = 'Congrats! You have defeated the AI!';
                  toggleNewGameButtonVisibility();
                }
              } else {
                grid.appendChild(hitIcon);
                statusMessage.innerText = 'Nice! Your Attack Landed!'
              }
            } else if (coordinateStatus === SHIP_STATUS.MISSED) {
              grid.appendChild(missIcon);
              statusMessage.innerText = 'Your Attack Missed.'           
            }
            Game.toggleTurn();
            AIAttackDOM();
        } 
      }
  })
})}

function populatePlayerGridPositions(){
  const player = getPlayer(1); 
  for(let i = 1; i <= 10; i+=1){
    for(let j = 1; j <= 10; j+=1){
      const coordinateToCheck = new Coordinates(i, j);
      if(player.gameboard.board.get(coordinateToCheck.toString()) !== SHIP_STATUS.EMPTY){
        const gridElement = document.querySelector(`#player-grid [data-x='${i}'][data-y='${j}']`);
        const circleIcon = document.createElement('i');
        circleIcon.classList.add('fa-solid','fa-circle');
        gridElement.appendChild(circleIcon);
      }
    }
  }    
}

function createBattleScreenDOM(){
  const body = document.querySelector('body');
  body.removeAttribute('class');
  body.classList.add('battleship-screen');
  body.innerHTML = `
  <div class = "container">
    <div class="status">
      <h1>${getPlayer(1).name}: Begin the War</h1>
    </div>
    <div class = "both-sides-grids">
      <div class = "grid-and-buttons-container">
        <h2 class = "player-text">${getPlayer(2).name}'s Waters</h1>
        <div class ="ships-grid" id = "enemy-grid">
        </div>
      </div>
      <div class = "grid-and-buttons-container">
        <h2 class = "player-text"">${getPlayer(1).name}'s Waters</h1>
        <div class ="ships-grid" id = "player-grid">
        </div>
      </div>
    </div>
    <div class = "next-action-buttons">
      <button id = "new-game" class = "next-screen-button hidden">New Game</button> 
    </div>
  </div>
  `
  const grids = Array.from(document.querySelectorAll('.ships-grid'));
  grids.forEach(grid => {
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
  })
}

function renderBattleScreen(){
  removeBodyChildren();
  createBattleScreenDOM();
  populatePlayerGridPositions();
  addEnemyWaterClickFunctionality();
}

  function createPlaceShipDOM(){
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

  function addStartBattleButton(){
    const startGameBtn = document.getElementById('start-battle');
    startGameBtn.classList.remove('hidden');
    startGameBtn.addEventListener('click', () => {
      renderBattleScreen();
    })
  }

  function renderPlaceStatusMessage(player, currentShip){
    const statusMessage = document.querySelector('.status > h1');
    if(currentShip === null) {
      statusMessage.innerText = `${player.name}, Double Click to Change Orientation`;
      // TO-DO: add the double click functionality
      addStartBattleButton();
    }
    else {
      statusMessage.innerText = `${player.name}, Place Your ${currentShip.name} (${currentShip.length} Tiles)`
    }
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
  function placeShipsRender(){
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
  
  function initialRender(){
    removeBodyChildren();
    const body = document.querySelector('body');
    body.removeAttribute('class');
    body.classList.add('start-screen');
    body.innerHTML = `
      <div class = "container">
        <div class = "logo-container"><img class = "battleship-logo" src = "/assets/title.png"></div>
        <div class = "name-select">
          <h2 class="description-text">Choose Your Name:</h2>
          <input id = "username" autocomplete = "off">
        </div>
        <div>
          <button id = "start-game" class = "next-screen-button">Start Game </button>
        </div>
      </div>
    `

    // TO-DO - fix the enter key
    const startGameBtn = document.getElementById('start-game');
    startGameBtn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter'){
        startGameBtn.click();
      }
    })
    startGameBtn.addEventListener('click', () => {
      const usernameValue = document.getElementById('username').value;
      if(usernameValue !== ''){
        setPlayer(new HumanPlayer(usernameValue), 1);
        setPlayer(new AIPlayer, 2);
        placeShipsRender();
      }
    })
  }

  function addNewGameButtonFunctionality(){
    const newGameButton = document.getElementById('new-game');
    newGameButton.addEventListener('click', () => {
      initialRender();
    })
  } 

  return {
    initialRender,
    placeShipsRender,
    renderBattleScreen
  }
})();

export default ui;