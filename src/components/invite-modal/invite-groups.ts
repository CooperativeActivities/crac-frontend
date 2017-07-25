import { Component } from '@angular/core';
import {ToastController, ViewController} from 'ionic-angular';
import {UserDataService} from "../../services/user_service";

@Component({
  selector: 'invite-groups',
  templateUrl: './invite-groups.html',
  providers: [ UserDataService ]
})
export class InviteGroups {
  groups: Array<any> = [];
  restrictive: boolean = false;

  constructor(private viewCtrl: ViewController, public userDataService: UserDataService, public toast: ToastController) {
    this.userDataService.getAllGroups().then((res) => {
      this.groups = res.object;
    }, (error) => {
      this.toast.create({
        message: "Gruppen konnte nicht geladen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  invite(){
    let invites = this.groups.filter((group) => {
      return group.checked;
    });
    this.closeModal(invites);
  }

  closeModal(invites){
    this.viewCtrl.dismiss({
      invites: invites,
      restrictive: this.restrictive
    });
  }
}
