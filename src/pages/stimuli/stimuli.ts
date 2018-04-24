import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Stimuli, Utils } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-stimuli',
  templateUrl: 'stimuli.html',
})
export class StimuliPage {

  nextConfirmed: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private stimuli: Stimuli, 
    private utils: Utils, private translate: TranslateService) {

    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScenarioPresentPage');
  }

  confirmNext() {
    this.nextConfirmed = true;
  }

  next() {
    if (!this.nextConfirmed) return;
    this.navCtrl.setRoot("ScenarioQuestionPage");
  }
  
}
