import SHIP_STATUS from "../utils/ship-status"

// EXCEPTION: Grid Status for Hit is formatted as {Ship Name} - HIT
function isHit(gridStatus){
  return gridStatus.indexOf(SHIP_STATUS.HIT) !== -1;
}

function createHitStatus(shipName){
  return `${shipName} - ${SHIP_STATUS.HIT}`;
}

function getXFromStringifiedCoordinate(coordinate){
  const start = coordinate.indexOf("{") + 1;
  const end = coordinate.indexOf(","); 

  return coordinate.substring(start, end);
}

function getYFromStringifiedCoordinate(coordinate){
  const start =  coordinate.indexOf(",") + 1; 
  const end = coordinate.indexOf("}");
  return coordinate.substring(start, end);
}

export {isHit, createHitStatus, getXFromStringifiedCoordinate, getYFromStringifiedCoordinate};