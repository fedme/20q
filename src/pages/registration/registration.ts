import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Platform } from 'ionic-angular';
import { Stimuli, Data } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  lang: string = "en";
  availableLangs: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private stimuli: Stimuli, private data: Data, private toastCtrl: ToastController,
    private modalCtrl: ModalController, private platform: Platform, private translate: TranslateService) {
      
      // Parse available langs
      this.availableLangs = this.translate.langs;
      console.log('available langs: ', this.availableLangs);


      // Initialize providers
      this.stimuli.initialize();
      this.data.initialize();

      // Get language from localStorage
      if (localStorage.getItem('lang') != null && localStorage.getItem('lang') != '') {
        this.lang = localStorage.getItem('lang');
      }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
    if (this.parseUrlParams()) {
      console.log("participant:", this.stimuli.participant);
      this.navCtrl.setRoot('ConsentFormPage');
    }
  }

  handleRegistration() {
    if (this.validateRegistration()) {

      // set Language
      this.stimuli.setLang(this.lang);
      localStorage.setItem('lang', this.lang);
   
      // initialize stimuli
      this.stimuli.initializeConditions();
      this.navCtrl.setRoot('StimuliPage');
    }
  }

  validateRegistration() {
    const ageNull = this.stimuli.participant.age == null;
    const genderNull = this.stimuli.participant.gender == null;
    if (ageNull || genderNull) {
      let toast = this.toastCtrl.create({
        message: 'Please fill all the required fields',
        duration: 3000
      });
      toast.present();
      return false;
    }
    return true;
  }

  showRecords() {
    let recordsModal = this.modalCtrl.create("ViewRecordsPage");
    recordsModal.present();
  }

  parseUrlParams() {
    let codeProvided = false;
    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams){
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == "participant_code"){
          this.stimuli.participant.code = singleURLParam[1];
          codeProvided = true;
        }
        else if (singleURLParam[0] == "workerId"){
          this.stimuli.participant.code = singleURLParam[1];
          codeProvided = true;
        }
        else if (singleURLParam[0] == "participant_age"){
          this.stimuli.participant.age = parseInt(singleURLParam[1]);
        }
        else if (singleURLParam[0] == "participant_grade"){
          this.stimuli.participant.grade = parseInt(singleURLParam[1]);
        }
        else if (singleURLParam[0] == "condition"){
          this.stimuli.conditionCounterOverride = parseInt(singleURLParam[1]);
          this.stimuli.pickCondition();
          console.log("[param][conditionCounterOverride]", parseInt(singleURLParam[1]));
          console.log( this.stimuli.conditionCounterOverride);
        }
      }
    }
    return codeProvided;
  }
 

}
