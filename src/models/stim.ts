export class Stim {
    id: string;
    excluded: boolean = false;
    isTarget: boolean = false;

    exlusionOrder: number;
    exclusionMode: number;
    questionNumber: number;
    guessNumber: number;
  
    constructor(id, excluded, isTarget) {
      this.id = id;
      this.excluded = excluded;
      this.isTarget = isTarget;
    }
  
    exclude(exlusionOrder: number, exclusionMode: number, questionNumber, guessNumber) {
      this.excluded = true;
      this.exlusionOrder = exlusionOrder;
      this.exclusionMode = exclusionMode;
      this.questionNumber = questionNumber;
      this.guessNumber = guessNumber;
    }

    cancelExclude() {
      this.excluded = false;
    }
  
    get borderColor() {
      if (this.excluded && !this.isTarget)
        return 'red';
      if (this.excluded && this.isTarget)
        return 'green';
      return 'gray';
    }
}