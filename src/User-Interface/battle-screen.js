import {removeBodyChildren, getMissIconDOM, getHitIconDOM, getSunkIconDOM} from './helper'
import Game from '../game';
import {isHit, createHitStatus, getXFromStringifiedCoordinate, getYFromStringifiedCoordinate} from '../helper-functions'
import SHIP_STATUS from '../../utils/ship-status';
import {getPlayer} from '../datamanager'
import HumanPlayer from '../human-player';
import AIPlayer from '../ai-player';
import Coordinates from '../../utils/coordinates';
import PubSub from 'pubsub-js';

const battleScreen = (() => {
  function addNewGameButtonFunctionality(){
    const newGameButton = document.getElementById('new-game');
    newGameButton.addEventListener('click', ()=> {
      PubSub.publish('New Game');
    })
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter'){
        PubSub.publish('New Game');
      }
    })
  }
  
  function toggleNewGameButtonVisibility(){
    const newGameButton = document.getElementById('new-game');
    newGameButton.classList.toggle('hidden');
    addNewGameButtonFunctionality();
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
      statusMessage.innerText += ' AI Player missed their attack.';
    } else if(isHit(gridStatus)){
      const numberShipsSunkAfter = enemy.gameboard.ships_sunk.length;
      // in case one of the ships have been sunk
      if(numberShipsSunkAfter > numberShipsSunkBefore) {
        const shipSunk = enemy.gameboard.ships_sunk[numberShipsSunkAfter - 1].name;
        replaceHitWithSunkDOM(enemy, 1, shipSunk);
        statusMessage.innerText += ` AI Player has sunk the your ${shipSunk}.`;
        if(Game.isOver(enemy, player)){
          statusMessage.innerText = `AI Player has won. GG!`
          toggleNewGameButtonVisibility();
        }
      } else {
        while(AiPlayerGridAttackedDOM.firstChild !== null){
          AiPlayerGridAttackedDOM.firstChild.remove();
        }
        AiPlayerGridAttackedDOM.appendChild(hitIcon);
        statusMessage.innerText += ` AI Player's attack has landed.`;
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
                statusMessage.innerText = `You have sunk the enemy's ${shipSunk}.`;
                if(Game.isOver(player, enemy)){
                  statusMessage.innerText = 'Congrats! You have defeated the AI!';
                  toggleNewGameButtonVisibility();
                }
              } else {
                grid.appendChild(hitIcon);
                statusMessage.innerText = 'Nice! Your attack landed!'
              }
            } else if (coordinateStatus === SHIP_STATUS.MISSED) {
              grid.appendChild(missIcon);
              statusMessage.innerText = 'Your attack missed.'           
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

function render(){
  removeBodyChildren();
  createBattleScreenDOM();
  populatePlayerGridPositions();
  addEnemyWaterClickFunctionality();
}

  return {render};
})();

export default battleScreen;