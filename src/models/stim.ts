export class Stim {
    img: string;
    excluded: boolean = false;
    isTarget: boolean = false;
  
    constructor(img, excluded, isTarget) {
      this.img = img;
      this.excluded = excluded;
      this.isTarget = isTarget;
    }
  
    clicked() {
      this.excluded = true;
    }
  
    get borderColor() {
      if (this.excluded && !this.isTarget)
        return 'red';
      if (this.excluded && this.isTarget)
        return 'green';
      return 'gray';
    }
}