import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Stimuli, Utils } from '../../providers/providers';
import { Stim } from '../../models/stim';


@IonicPage()
@Component({
  selector: 'page-stimuli',
  templateUrl: 'stimuli.html',
})
export class StimuliPage {

  mode: Mode = Mode.View;

  exclusionCounter: number = 1;
  questionCounter: number = 0;
  guessCounter: number = 0;

  nextConfirmed: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private stimuli: Stimuli, 
    private utils: Utils, private translate: TranslateService, private alertCtrl: AlertController,
    private toastCtrl: ToastController) {

      //TODO: remove!!!!
      this.stimuli.initializeConditions();
    
  }

  askQuestion() {
    this.questionCounter++;
    this.mode = Mode.Question;
  }

  cancelAskQuestion() {
    this.questionCounter--;
    this.mode = Mode.View;
  }

  endAskQuestion() {
    this.mode = Mode.View;
  }

  guessTarget() {
    this.guessCounter++;
    this.mode = Mode.Guess;
  }

  cancelGuessTarget() {
    this.guessCounter--;
    this.mode = Mode.View;
  }

  endGuessTarget() {
    this.mode = Mode.View;
  }

  stimClicked(stim: Stim) {

    if (this.mode == Mode.View && !stim.excluded) {
      return;
    }

    if (this.stimuli.targetStim.excluded && !stim.isTarget && !stim.excluded) {
      let toast = this.toastCtrl.create({
        message: 'Target stimuli already found',
        duration: 3000,
        position: 'bottom'
      });
      return toast.present();
    }
     
    if (!stim.excluded) {
      this.exclusionCounter++;
      return stim.exclude(
        this.exclusionCounter, 
        this.mode, 
        this.questionCounter, 
        this.guessCounter
      );
    }
    
    let alert = this.alertCtrl.create({
      title: 'Re-include?',
      message: 'Do you want to include back ' + stim.id + '?',
      buttons: [
        {
          text: 'Yes, re-include',
          handler: () => {
            stim.cancelExclude();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScenarioPresentPage');
  }

  confirmNext() {
    if (!this.stimuli.targetStim.excluded) {
      let toast = this.toastCtrl.create({
        message: 'Target stimuli not yet found',
        duration: 3000,
        position: 'bottom'
      });
      return toast.present();
    }
    this.nextConfirmed = true;
  }

  next() {
    if (!this.nextConfirmed) return;
    console.log(this.stimuli.stims);
    //this.navCtrl.setRoot("ScenarioQuestionPage");
  }
  
}

export enum Mode {
  View = 0,
  Question = 1,
  Guess = 2
}
