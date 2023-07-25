export default class Ship {
  constructor(length){
    if(typeof length !== 'number'){
      throw new Error ("length input is not a number");
    }
    if(length > 10 || length <= 0){
      throw new Error("length input cannot be greater than 10 or less than 1")
    }
    this.length = length;
    this.numOfTimesHit = 0;
    this.id = 0;
  }

  setID(newId){
    this.id = newId;
  }

  hit(){
    this.numOfTimesHit += 1;
  }

  isSunk(){
    if(this.length === this.numOfTimesHit){
      return true;
    }
    return false;
  }
}