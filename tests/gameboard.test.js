import Gameboard from '../src/gameboard';
import SHIP_STATUS from '../utils/ship-status';
import Coordinates from '../utils/coordinates';
import ORIENTATION from '../utils/orientation'
import Ship from '../src/ship'


describe('Place Ships', () =>{
  describe ('invalid values for placing ships', () => {
    test('the coordinate is invalid (0,0)', () => {
      const testShip = new Ship(5);
      const testGameboard = new Gameboard();
      const coordinateInvalid = new Coordinates(0,0);
      expect(()=> testGameboard.place({
        ship: testShip,
        startingCoordinate: coordinateInvalid,
      })).toThrow('Coordinate is invalid');
    })

    test('the coordinate is invalid (-1,-10)', () => {
      const testShip = new Ship(5);
      const testGameboard = new Gameboard();
      const coordinateInvalid = new Coordinates(-1,-10);
      expect(() => testGameboard.place({
        ship: testShip,
        startingCoordinate: coordinateInvalid,
      })).toThrow('Coordinate is invalid');
    })

    test ('another ship is already placed at that starting coordinate', () => {
      const testShip = new Ship(5);
      const testShip2 = new Ship(3);
      const testGameboard = new Gameboard();
      const sameCoordinates = new Coordinates(1,1);

      expect(() => {
        testGameboard.place({ship: testShip, startingCoordinate: sameCoordinates});      
        testGameboard.place({ship: testShip2, startingCoordinate: sameCoordinates});
      }).toThrow('Another ship is already placed at that coordinate');
    })

    test ('part of the ship would intersect with another part of the ship', () => {
      const testShip = new Ship(5);
      const testShip2 = new Ship(3);
      const testGameboard = new Gameboard();
      const coordinate1 = new Coordinates(1,1);
      const coordinate2 = new Coordinates(1, 5);

      expect(() => {
        testGameboard.place({ship: testShip, startingCoordinate: coordinate1});      
        testGameboard.place({ship: testShip2, startingCoordinate: coordinate2});
      }).toThrow('Another ship is already placed at that coordinate');
    })
  })


  describe('placing ships for horizontal and vertical orientations works', () => {
    const testShip = new Ship(5);
    const testShip2 = new Ship(3);
    const testGameboard = new Gameboard();
    const coordinate1 = new Coordinates(1,1);
    const coordinate2 = new Coordinates(5, 5);

    test('vertical orientation works', () => {
        testGameboard.place({ship: testShip, startingCoordinate: coordinate1, direction: ORIENTATION.y});
        for(let i = 0; i < testShip.length; i+=1){
          const coordinateToCheckStringified = new Coordinates(coordinate1.x, coordinate1.y + i).toString();
          const gameboardTileStatus = testGameboard.board.get(coordinateToCheckStringified);
          expect(gameboardTileStatus).not.toBe(SHIP_STATUS.EMPTY);
        }
    });

    test('horizontal orientation works', () => {
        testGameboard.place({ship: testShip, startingCoordinate: coordinate2, direction: ORIENTATION.x});
        for(let i = 0; i < testShip2.length; i+=1){
          const coordinateToCheckStringified = new Coordinates(coordinate2.x + i, coordinate2.y).toString();
          const gameboardTileStatus = testGameboard.board.get(coordinateToCheckStringified);
          expect(gameboardTileStatus).not.toBe(SHIP_STATUS.EMPTY);
        }
    })
  });
})


describe("receive attack and all sunk gameboard", () => {
  const ship1 = new Ship(1);
  const gameboard = new Gameboard();
  gameboard.place({
    ship: ship1,
    startingCoordinate: new Coordinates(1,1),
    direction: ORIENTATION.x
  })

  test('missed works', () => {
    const missedCoordinate = new Coordinates(10,10)
    gameboard.receiveAttack(missedCoordinate);
    expect(gameboard.board.get(missedCoordinate.toString())).toBe(SHIP_STATUS.MISSED);
  })

  test('hit works', () => {
    gameboard.receiveAttack(new Coordinates(1,1));
    expect(ship1.isSunk()).toBeTruthy();
  })

  test('cannot receive attack when coordinate has already been attacked before', () => {
    expect(() => {
      gameboard.receiveAttack(new Coordinates(1,1))
    }).toThrow('Coordinate has already been attacked before');
  })

  test('all sunk', () => {
    expect(gameboard.allShipsSunk()).toBeTruthy();
  })

})
