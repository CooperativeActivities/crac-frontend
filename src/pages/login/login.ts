import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from "../../services/auth_service";

@IonicPage({
  name: "login",
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public username: string;
  public password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController,
    private auth_service: AuthService) {}

  public async login(event){
    event.preventDefault();
    let res, err;
    try {
      res = await this.auth_service.login(this.username, this.password)
    } catch(e){
      err = e
    }
    if(err){
      console.error(err)
      this.toastCtrl.create({ message: "Login fehlgeschlagen: Username oder Passwort falsch", duration: 3000 }).present()
    } else {
      // has to be TabsPage cause if i do HomePage here it doesn't show the navigation bar
      // (if we want to ensure we show the homepage we might wanna use navCtrl.setPages?)
      this.navCtrl.setRoot("tabs")
    }
  }

}
