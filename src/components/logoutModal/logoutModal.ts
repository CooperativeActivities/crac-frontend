import { Component } from '@angular/core';
import { AuthService } from '../../services/auth_service';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'logoutModal.html'
})
export class LogoutModal {
  constructor(private authService: AuthService, private viewCtrl: ViewController) { }
  logout(){
    console.log("logout");
    this.authService.logout();
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
}
