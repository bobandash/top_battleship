function removeBodyChildren(){
  const bodyElement = document.querySelector('body');
  while(bodyElement.lastChild){
    bodyElement.removeChild(bodyElement.lastChild);
  }
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

export {removeBodyChildren, getMissIconDOM, getHitIconDOM, getSunkIconDOM};