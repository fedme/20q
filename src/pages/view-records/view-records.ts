import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Data } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-view-records',
  templateUrl: 'view-records.html',
})
export class ViewRecordsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: Data) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRecordsPage');
    this.data.loadAllRecords();
  }

  getRecordsAsString() {
    return JSON.stringify(this.data.allRecords);
  }

}
