import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { StimuliPage } from './stimuli';

@NgModule({
  declarations: [
    StimuliPage,
  ],
  imports: [
    IonicPageModule.forChild(StimuliPage),
    TranslateModule.forChild()
  ],
})
export class StimuliPageModule {}
