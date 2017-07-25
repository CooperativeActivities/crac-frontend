import { Component } from '@angular/core';
import {NavParams, ToastController, ViewController} from 'ionic-angular';
import {UserDataService} from "../../services/user_service";

@Component({
  selector: 'invite-groups',
  templateUrl: './invite-groups.html',
  providers: [ UserDataService ]
})
export class InviteGroups {
  groups: Array<any> = [];
  restrictive: boolean = false;
  initState: any;

  constructor(private viewCtrl: ViewController, public params: NavParams,
              public userDataService: UserDataService, public toast: ToastController) {
    this.initState = {
      invites: this.params.get('invites') || [],
      restrictive: this.params.get('restrictive') || false
    }
    this.restrictive = this.params.get('restrictive');

    this.userDataService.getAllGroups().then((res) => {
      let invitedGroups = this.params.get('invites');

      this.groups = res.object;
      if(invitedGroups.length > 0) {
        for(let group of this.groups) {
          let inInvites = invitedGroups.findIndex((g) => {
            return g.id === group.id;
          });
          if(inInvites > -1) {
            group.checked = true;
          }
        }
      }
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
    this.closeModal({invites: invites, restrictive: this.restrictive});
  }

  closeModal(params){
    this.viewCtrl.dismiss(params);
  }
}
