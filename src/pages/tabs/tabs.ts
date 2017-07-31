import { Component } from '@angular/core';
import {Events, IonicPage} from 'ionic-angular';

import { AuthService } from '../../services/auth_service';
import {UserDataService} from "../../services/user_service";


@IonicPage({
  name: "tabs"
})
@Component({
  templateUrl: 'tabs.html',
  providers: [UserDataService]
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = "home";
  tab2Root: any = "task-list";
  tab3Root: any = "my-tasks";
  tab4Root: any = "messages";
  tab5Root: any = "profile";

  notificationCount: number;

  constructor(private authService: AuthService, private userDataService: UserDataService, public events: Events) {
    this.notificationCount = 0;
    events.subscribe('notification:update', (newCt) => {
      this.notificationCount = newCt;
    });
  }

  getNotificationCount() {
    return (this.notificationCount < 1) ? "" : this.notificationCount;
  }

  getNotifications() {
    this.userDataService.getNotification().then((res) => {
      let notifications = res.object.filter((n) => {
        return n.name === 'Friend Request' || n.name === 'Evaluation';
      });
      this.notificationCount = notifications.length;
    }, function(error) {
      console.log("Could not get notifications:" + error.message);
    });
  }

  ionViewCanEnter(): boolean{
   return this.authService.isAuthenticated()
  }

  ionViewDidEnter() {
    this.getNotifications();
    setInterval(()=>{this.getNotifications();}, 120000);
  }
}
