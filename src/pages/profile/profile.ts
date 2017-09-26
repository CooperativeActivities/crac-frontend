import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth_service';

@IonicPage({
  name: "profile",
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  pages: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authService: AuthService, private alert: AlertController,
  ) {
    this.pages = [
      { title: 'Meine Grunddaten', component: "profile-details" },
      { title: 'Meine Kompetenzen', component: "my-competences" },
      { title: 'Meine Freunde', component: "my-friends" },
      { title: 'Meine bisherigen Aufgaben', component: "my-history" }
    ];
  }

  openPage(page) {
    this.navCtrl.push(page.component)
  }

  logoutModal(){
    this.alert.create({
      title: 'Wirklich Ausloggen?',
      buttons: [
        {
          text: 'Eingeloggt Bleiben',
          role: 'cancel'
        },
        {
          text: 'Ausloggen',
          handler: () => {
            console.log("logout");
            this.authService.logout();
          }
        }
      ]
    }).present();
  }
}
