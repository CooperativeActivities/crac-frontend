import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'invite-groups',
  templateUrl: './invite-groups.html'
})
export class InviteGroups {
  groups: Array<any> = [];
  restrictive: boolean = false;

  constructor(private viewCtrl: ViewController) {
    //this.taskDataService.getAllGroups.then((res) => {
    let res = {object: [
      {
        id: 1,
        name: 'Group 1'
      },
      {
        id: 2,
        name: 'Group 2'
      },
      {
        id: 3,
        name: 'Group 3'
      }
    ]};
    this.groups = res.object;
    //}
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
