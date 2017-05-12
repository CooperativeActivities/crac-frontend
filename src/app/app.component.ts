import { Component, ViewChild } from '@angular/core';
import { ModalController, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

import { SettingsPage } from '../pages/settings/settings';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth_service';

import { LogoutModal } from '../components/logoutModal/logoutModal';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = TabsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, private authService: AuthService, private modalCtrl: ModalController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Homepage', component: TabsPage },
      { title: 'Settings', component: SettingsPage },
      { title: 'Account', component: AccountPage },
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
      this.nav.setRoot(TabsPage)
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logoutModal(){
    this.modalCtrl.create(LogoutModal).present()
  }
}
