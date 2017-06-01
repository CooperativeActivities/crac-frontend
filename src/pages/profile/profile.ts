import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { LogoutModal } from '../../components/logoutModal/logoutModal';

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
    private modalCtrl: ModalController,
  ) {
    this.pages = [
      { title: 'Meine Kompetenzen', component: "my-competences" },
      { title: 'Profil', component: "my-profile" },
    ];
  }

  openPage(page) {
    this.navCtrl.push(page.component)
  }

  logoutModal(){
    this.modalCtrl.create(LogoutModal).present()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
