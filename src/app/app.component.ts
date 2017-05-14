import { Component, ViewChild } from '@angular/core';
import { ModalController, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth_service';

import { LogoutModal } from '../components/logoutModal/logoutModal';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = "tabs";

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, private authService: AuthService, private modalCtrl: ModalController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Homepage', component: "tabs" },
      { title: 'Meine Kompetenzen', component: "my-competences" },
      { title: 'Account', component: "my-profile" },
    ];

  }

  async initializeApp() {
    await this.platform.ready()
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    StatusBar.styleDefault();
    Splashscreen.hide();

    await this.authService.getCredentials()
    if(!this.authService.isAuthenticated()){
      this.nav.setRoot(LoginPage)
    } else {
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
      /*
      this.nav.setRoot("tabs")
       */
    }
  }

  openPage(page) {
    // @ENTRY
    // IMPORTANT: https://github.com/driftyco/ionic-conference-app/blob/master/src/app/app.component.ts
    // (or ../ionic-conference-example)
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logoutModal(){
    this.modalCtrl.create(LogoutModal).present()
  }
}
