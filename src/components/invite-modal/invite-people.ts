import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'invite-people',
  templateUrl: './invite-people.html'
})
export class InvitePeople {
  constructor(private viewCtrl: ViewController) { }

  invite(){
    let invites = {};
    this.viewCtrl.dismiss(invites);
  }

  closeModal(invites){
    this.viewCtrl.dismiss(invites);
  }
}
