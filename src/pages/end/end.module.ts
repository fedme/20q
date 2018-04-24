import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EndPage } from './end';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EndPage,
  ],
  imports: [
    IonicPageModule.forChild(EndPage),
    TranslateModule.forChild()
  ],
})
export class EndPageModule {}
