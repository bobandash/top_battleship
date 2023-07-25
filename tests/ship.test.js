import Ship from '../src/ship'


/*tests for length */
test('ship length works if integer is passed', () => {
  const destroyer = new Ship(4);
  const mini = new Ship(1)
  
  expect(destroyer.length).toBe(4);
})

test('constructor should throw an error if length input is not a number', () => {
  expect(() => {
    const invalidShip = new Ship("test");
  }).toThrow('length input is not a number');
});


test('constructor should throw an error if length integer is valid', () => {
  expect(() => {
    const invalidShip1 = new Ship(0);
  }).toThrow('length input cannot be greater than 10 or less than 1');

  expect(() => {
    const invalidShip2 = new Ship(0);
  }).toThrow('length input cannot be greater than 10 or less than 1');

  expect(() => {
    const invalidShip3 = new Ship(0);
  }).toThrow('length input cannot be greater than 10 or less than 1');
});


describe('hit and sunk function for ship works', () => {
  let fiveLengthShip;

  beforeEach(() => {
    fiveLengthShip = new Ship(5);
  });
  test.each([
    [1, false], // Hit once, should not be sunk
    [2, false], // Hit twice, should not be sunk
    [3, false], // Hit thrice, should not be sunk
    [4, false], // Hit four times, should not be sunk
    [5, true],  // Hit five times, should be sunk
  ])('Hit and sunk function for ship works', (hits, expectedSunkStatus) => {
    for (let i = 0; i < hits; i++) {
      fiveLengthShip.hit();
    }

    const sunkStatus = fiveLengthShip.isSunk();
    expect(sunkStatus).toBe(expectedSunkStatus);
  });
});