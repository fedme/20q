export class Stim {
    id: string;
    excluded: boolean = false;
    isTarget: boolean = false;

    exclusionOrder: number;
    exclusionMode: number;
    queryNumber: number;
    questionNumber: number;
    guessNumber: number;
  
    constructor(id, excluded, isTarget) {
      this.id = id;
      this.excluded = excluded;
      this.isTarget = isTarget;
    }
  
    exclude(exclusionOrder: number, exclusionMode: number, questionNumber, guessNumber, queryNumber) {
      this.excluded = true;
      this.exclusionOrder = exclusionOrder;
      this.exclusionMode = exclusionMode;
      this.questionNumber = questionNumber;
      this.guessNumber = guessNumber;
      this.queryNumber = queryNumber;
    }

    cancelExclude() {
      this.excluded = false;
      this.exclusionOrder = null;
      this.exclusionMode = null;
      this.questionNumber = null;
      this.guessNumber = null;
    }
  
    get borderColor() {
      if (this.excluded && !this.isTarget)
        return 'red';
      if (this.excluded && this.isTarget)
        return 'green';
      return 'gray';
    }
}