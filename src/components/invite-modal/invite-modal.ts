import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'invite-modal',
  templateUrl: './invite-modal.html'
})
export class InviteModal {
  constructor(private viewCtrl: ViewController) { }

  invite(){
    let invites = {};
    this.viewCtrl.dismiss(invites);
  }

  closeModal(invites){
    this.viewCtrl.dismiss(invites);
  }
}
