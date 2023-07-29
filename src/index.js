import '../styles/main.css';
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PubSub from 'pubsub-js';
import startScreen from './User-Interface/start-screen';
import placeShipScreen from './User-Interface/place-ships';
import battleScreen from './User-Interface/battle-screen';
/* ui.placeShipsRender(); */
/* ui.renderBattleScreen(); */
startScreen.render();

PubSub.subscribe('Start Placing Ships', () => {
  placeShipScreen.render();
})


PubSub.subscribe('Start Battling', () => {
  battleScreen.render();
});

PubSub.subscribe('New Game', () => {
  startScreen.render();
})