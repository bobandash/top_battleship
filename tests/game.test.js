import Game from '../src/game'

describe('turn based system works', () => {
    test('turn changes every round', () => {
      Game.toggleTurn();
      expect(Game.getIsPlayerOneTurn()).toBe(false);
    })
})