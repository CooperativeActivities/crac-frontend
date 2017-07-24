import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'invite-groups',
  templateUrl: './invite-groups.html'
})
export class InviteGroups {
  constructor(private viewCtrl: ViewController) { }

  invite(){
    let invites = {};
    this.viewCtrl.dismiss(invites);
  }

  closeModal(invites){
    this.viewCtrl.dismiss(invites);
  }
}
