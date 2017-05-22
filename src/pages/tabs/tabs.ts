import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { AuthService } from '../../services/auth_service';


@IonicPage({
  name: "tabs"
})
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = "home";
  tab2Root: any = "task-list";
  tab3Root: any = "my-tasks";
  tab4Root: any = "messages";
  tab5Root: any = "profile";

  constructor(private authService: AuthService) {
  }

  ionViewCanEnter(): boolean{
   return this.authService.isAuthenticated()
  }
}
