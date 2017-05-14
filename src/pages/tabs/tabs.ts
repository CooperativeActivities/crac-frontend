import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../services/auth_service';
import { IonicPage } from 'ionic-angular';


@IonicPage({
  name: "tabs",
})
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = "home";
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;

  constructor(private authService: AuthService) { }

  ionViewCanEnter(): boolean{
   return this.authService.isAuthenticated()
  }
}
