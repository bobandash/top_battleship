export default class Ship {
  constructor(length){
    if(typeof length !== 'number'){
      throw new Error ("length input is not a number");
    }
    if(length > 10 || length <= 0){
      throw new Error("length input cannot be greater than 10 or less than 1")
    }
    this._length = length;
    this._numOfTimesHit = 0;
  }

  get length(){
    return this._length;
  }

  hit(){
    this._numOfTimesHit += 1;
  }

  isSunk(){
    if(this._length === this._numOfTimesHit){
      return true;
    }
    return false;
  }
}