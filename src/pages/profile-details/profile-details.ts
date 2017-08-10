import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import { UserDataService } from '../../services/user_service';

@IonicPage({
  name: "profile-details",
})
@Component({
  selector: 'page-profile-details',
  templateUrl: 'profile-details.html',
  providers: [ UserDataService ],
})
export class ProfileDetailsPage {
  public user: any;
  userId: number;
  isCurrentUser: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userDataService: UserDataService, public toast: ToastController) {}

  ngOnInit(): void {
    let userId = this.navParams.get("id");
    if(userId !== undefined) {
      this.userId = userId;
    } else {
      this.isCurrentUser = true;
    }
    this.doRefresh();
  }

  doRefresh() {
    if (this.isCurrentUser) {
      this.getCurrentUser();
    } else {
      this.getOtherUser();
    }
  }

  getUserError(error) {
    console.log(error);
    this.toast.create({
      message: "Benutzerinformation kann nicht gefolgt werden: " + error.message,
      position: 'top',
      duration: 3000
    }).present();
  }

  getCurrentUser() {
    this.userDataService.getCurrentUser().then((res) => {
      this.user = res.object;
    }).catch(this.getUserError)
  }

  getOtherUser() {
    this.userDataService.getUserById(this.userId).then((res) => {
      this.user = res.object;
    }).catch(this.getUserError)
  }

  editProfile() {
    this.navCtrl.push('profile-edit');
  }
}
