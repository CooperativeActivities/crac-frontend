import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {UserDataService} from "../../services/user_service";

@IonicPage({
  name: "my-friends",
})
@Component({
  selector: 'page-my-friends',
  templateUrl: 'my-friends.html',
  providers: [UserDataService]
})
export class MyFriendsPage {

  friends : Array<any> = [];
  allUsers : Array<any> = [];
  userToSendRequestTo : any = null;

  constructor(public userDataService: UserDataService, public navCtrl: NavController, public toast: ToastController) {
    this.doRefresh();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyFriendsPage');
  }

  sendRequest() {
    let self = this;
    if (!self.userToSendRequestTo) return;

    self.userDataService.friendRequest(self.userToSendRequestTo)
    .then(function (res) {
      self.toast.create({
        message: "Freundschaftsanfrage versandt",
        position: 'top',
        duration: 3000
      }).present();
      self.userToSendRequestTo = null;
    }, function (error) {
      self.toast.create({
        message: "Freundschaftsanfrage fehlgeschlagen: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  doRefresh(){
    let self = this;

    self.userDataService.getFriends().then(function(res){
      self.friends = res.object
    }, function(error){
      self.toast.create({
        message: "Freunde können nicht geladen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });

    self.userDataService.getAllUsers().then(function(res){
      self.allUsers = res.object
    }, function(error){
      self.toast.create({
        message: "Benutzer können nicht geladen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    })
  }

  viewProfile(friendId) {
    this.navCtrl.push('profile-details', {id: friendId});
  }
}
