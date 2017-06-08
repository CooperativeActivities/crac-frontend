import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AuthService } from '../services/auth_service';


@Component({
  templateUrl: 'app.template.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = "tabs";

  constructor(public platform: Platform,
    private authService: AuthService,
    public statusBar: StatusBar, public splashScreen: SplashScreen,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready()
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.statusBar.styleDefault();
    this.splashScreen.hide();

    await this.authService.getCredentials()
    if(!this.authService.isAuthenticated()){
      this.nav.setRoot("login")
    } else {
      this.nav.setRoot("tabs")
      // maybe do the getActiveChild or whatever? from the ionic2-conference-example?
        /*
      try {
        let segments = this.nav._linker._segments
        let first = segments.shift()
        await this.nav.setRoot(first.name)
        if(segments.length > 1){
          for(let segment of segments){
            if(segment.name){
              await this.nav.push(segment.name)
            }
          }
        }
      } catch(e) {
        this.nav.setRoot("tabs");
      }
         */
    }
  }


}
