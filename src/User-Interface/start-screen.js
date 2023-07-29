import { removeBodyChildren } from "./helper"
/* import placeShipScreen from './place-ships' */
import Game from "../game"
import PubSub from "pubsub-js";

const startScreen = (() => {

  function startGame(){
    const usernameValue = document.getElementById('username').value;
    if(usernameValue !== ''){
      Game.start(usernameValue);
      PubSub.publish('Start Placing Ships');
    } else {
      const errorMessage = document.querySelector('.error-message');
      errorMessage.classList.remove('hidden');
    }
  }

  function hideErrorMessageIfInputSelected(){
    const errorMessage = document.querySelector('.error-message');
    const input = document.getElementById('username');
    input.addEventListener('focus', () => {
      if(!errorMessage.classList.contains('hidden')){
        errorMessage.classList.add('hidden');
      }
    })
  }


  function render(){
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
          <p class = "error-message hidden">ERROR: Name cannot be blank</p>
        </div>
        <div>
          <button id = "start-game" class = "next-screen-button">Start Game </button>
        </div>
      </div>
    `
    const startGameBtn = document.getElementById('start-game');
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter'){
        startGame();
      }
    })
    hideErrorMessageIfInputSelected();
    startGameBtn.addEventListener('click', startGame)
  }

  return {render};
})();

export default startScreen;