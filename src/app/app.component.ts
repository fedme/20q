import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { RegistrationPage } from '../pages/registration/registration';
import { Stimuli} from '../providers/providers';

declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'RegistrationPage';

  constructor(private translate: TranslateService, private platform: Platform, private statusBar: StatusBar,
    private splashScreen: SplashScreen, private androidFullScreen: AndroidFullScreen,
    private stimuli: Stimuli) {
    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.enterPinnedMode();
			this.enterImmersiveMode();
    });
    this.initTranslate();
  }

  /**
	 * enterPinnedMode()
	 */
	enterPinnedMode() {
		if (typeof cordova !== 'undefined') {
			cordova.plugins.screenPinning.enterPinnedMode(
				() => { console.log('entered pinned mode') },
				(error) => { console.log('error when entering pinned mode: ' + error) },
				true
			);
		}
	}

	/**
	 * enterImmersiveMode()
	 */
	enterImmersiveMode() {
		this.androidFullScreen.isImmersiveModeSupported()
			.then(() => this.androidFullScreen.immersiveMode())
			.catch((error: any) => console.log(error));
	}

  initTranslate() {
    // Set the default language
    this.translate.addLangs(['en', 'de']);
    this.translate.setDefaultLang('en');

    // Get language from local storage
    if (localStorage.getItem('lang') != null && localStorage.getItem('lang') != '') {
      this.translate.use(localStorage.getItem('lang'));
    }

    // Update language when changed by an app component
    this.stimuli.langChangedEvent.subscribe(lang => {
      console.log('language change evend emitted: ', lang);
      this.translate.use(lang);
    });

  }

}

