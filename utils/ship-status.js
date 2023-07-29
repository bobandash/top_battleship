/* when ships are placed, they are tracked by their id */
const SHIP_STATUS = {
  EMPTY: '',
  MISSED: 'Missed',
  // EXCEPTION: Grid Status for Hit is formatted as {Ship Name} - HIT
  HIT: 'Hit',
  Sunk: 'Sunk'
}

export default SHIP_STATUS;