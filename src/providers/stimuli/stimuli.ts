import { Injectable, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Utils } from '../utils/utils';
import { Participant } from '../../models/participant';
import { Stim } from '../../models/stim';
import { STIMULIS } from './constants';

@Injectable()
export class Stimuli {

  public langChangedEvent: EventEmitter<string> = new EventEmitter();
  lang: string = "en";

  // general exp
  shortVersion: boolean = false;
  condition: any;
  conditionId: number;
  initialTimestamp: number;
  participant: Participant;
  conditionCounterOverride: number = null;
  runInBrowser: boolean = false;

  //stimuli
  stims: Stim[] = [];
  targetStimIndex: number;

  
  constructor(private utils: Utils, private platform: Platform) {
    console.log('Hello Stimuli Provider');
    this.participant = new Participant("anonymous-" + this.utils.getCounterValue());
    //this.runInBrowser = this.platform.is('core') || this.platform.is('mobileweb'); TODO: not detecting windows UWA
    this.runInBrowser = false
    console.log("You are running", this.platform)

    if (localStorage.getItem('lang') != null && localStorage.getItem('lang') != "") {
      this.lang = localStorage.getItem('lang')
    }
  }

  initialize() {
    this.shortVersion = false; 
    this.initialTimestamp = Date.now(); 
    this.participant = new Participant("anonymous-" + this.utils.getCounterValue());
  }

  initializeConditions() {
    this.initialTimestamp = Date.now();
    
    let ids = STIMULIS;
    this.utils.shuffleArray(ids);
    const targetId = this.utils.pickRandomFromArray(ids);

    let i = 0;
    for (let id of ids) {
      this.stims.push(new Stim(id, false, id == targetId));
      if (id == targetId) {
        this.targetStimIndex = i;
      }
      i++;
    }
    
    //this.pickCondition();
    //this.setupScenarios();
  }

  get targetStim() {
    return this.stims[this.targetStimIndex];
  }

  pickCondition() {

    this.condition = this.utils.pickFirstCondition();
    this.conditionId = this.condition['id'];
    console.log('Picked condition', this.condition);
  }

  setupScenarios() {

  }


  // TODO: age groups
  getParticipantAgeGroup() {
    if (this.participant.age >= 18) return 18;
    return this.participant.age;
  }

  setLang(langCode: string) {
    this.langChangedEvent.emit(langCode);
  }

}
