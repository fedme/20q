import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { CONDITIONS } from '../stimuli/conditions';

@Injectable()
export class Utils {

  constructor() {
    console.log('Hello Utils Provider');
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }

  pickRandomFromArray(items) {
    return items[Math.floor(Math.random()*items.length)];
  }

  pickRandFromArrayNoRep(items) {
    const i = Math.floor(Math.random()*items.length);
    const el = items[i];
    items.splice(i, 1);
    return el;
  }

  range(start, end) {
    return Array.from({length: (end - start)}, (v, k) => k + start);
  }

  combine(alphabet, length, curstr) {
    if (curstr.length == length) return [curstr];
    var ret = [];
    for (var i = 0; i < alphabet.length; i++) {
      ret.push.apply(ret, this.combine(alphabet, length, curstr + alphabet[i]));
    }
    return ret;
  }

  permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;
  
    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = permutation[i];
        permutation[i] = permutation[k];
        permutation[k] = p;
        ++c[i];
        i = 1;
        result.push(permutation.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }

  /* Counters */
  getCounterValue(counterIndex: number = 1) {
    let counterName = "isrc-counter-" + counterIndex;
    if (localStorage.getItem(counterName) === null) {
      return 0;
    }
    return parseInt(localStorage.getItem(counterName));
  }

  incrementCounter(counterIndex: number = 1) {
    let counterName = "isrc-counter-" + counterIndex;
    let count: number = 1;
    if (localStorage.getItem(counterName) != null) {
      count = parseInt(localStorage.getItem(counterName)) + 1;
    }
    localStorage.setItem(counterName, count.toString());  
  }

  getAllConditions() {
    // Parse all conditions form local storage
    let allConditions = null;
    if (localStorage.getItem("isrc-all-conditions") != null) {
      allConditions = JSON.parse(localStorage.getItem("isrc-all-conditions"));
    }

    if (allConditions != null && allConditions.constructor === Array && allConditions.length > 0) {
      return allConditions;
    }
    else {
      localStorage.setItem("isrc-all-conditions", JSON.stringify(CONDITIONS));
      return CONDITIONS;
    }
  }

  pickOneCondition(random: boolean = true) {
    let allConditions = this.getAllConditions();
    const condition = this.pickRandFromArrayNoRep(allConditions);
    localStorage.setItem("isrc-all-conditions", JSON.stringify(allConditions));
    return condition;
  }

  pickFirstCondition() {
    let allConditions = this.getAllConditions();
    const condition = allConditions[0];
    allConditions.splice(0, 1);
    localStorage.setItem("isrc-all-conditions", JSON.stringify(allConditions));
    return condition;
  }

}
