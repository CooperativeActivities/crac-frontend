import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

import { SettingsPage } from '../pages/settings/settings';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth_service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = TabsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, private authService: AuthService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Homepage', component: TabsPage },
      { title: 'Settings', component: SettingsPage },
      { title: 'Account', component: AccountPage },
      { title: 'Login', component: LoginPage },
    ];

  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      if(!this.authService.isAuthenticated()){
        this.nav.setRoot(LoginPage)
      }
      /*
      $rootScope.globals = $cookieStore.get('globals') || {};
      if($rootScope.globals.currentUser != null){
        $http.defaults.headers.common['Token'] = $rootScope.globals.currentUser.token; // jshint ignore:line
        $http.defaults.headers.common['Authorization'] = $cookieStore.get('basic');
        // cannot call loggedIn here cause the controllers haven't been loaded yet
        //$rootScope.$emit("loggedIn")
      }
       */
    });
  }
}
