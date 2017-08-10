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
  currentUser: any;

  constructor(public userDataService: UserDataService, public navCtrl: NavController, public toast: ToastController) {
    this.doRefresh();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyFriendsPage');
  }

  getSelected(user) {
    return user.checked;
  }

  getAvailable(user) {
    let userIdx = this.friends.findIndex((u) => {
      return u.id === user.id
    });
    return userIdx === -1 && user.id !== this.currentUser.id;
  }

  resetSelections(requests) {
    for(let user of requests) {
      let userIdx = this.allUsers.findIndex((u) => {
        return u.id === user.id;
      });
      if( userIdx !== -1) {
        this.allUsers.splice(userIdx, 1);
      }
    }

    for(let user of this.allUsers) {
      user.checked = false;
    }
  }

  sendRequests() {
    let friendRequests = this.allUsers.filter(this.getSelected);
    let promises = [];
    for(let newFriend of friendRequests) {
      promises.push(this.userDataService.friendRequest(newFriend.id));
    }
    if(promises.length === 0) {
      this.toast.create({
        message: "Bitte wenigstens einen User auswählen",
        position: 'top',
        duration: 3000
      }).present();

      return false;
    }

    Promise.all(promises).then((res) => {
      this.toast.create({
        message: "Freundschaftsanfrage versandt",
        position: 'top',
        duration: 3000
      }).present();
      this.resetSelections(friendRequests);
    }, (error) => {
      this.toast.create({
        message: "Freundschaftsanfrage fehlgeschlagen: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  doRefresh(){
    let promises = [];

    promises.push(this.userDataService.getCurrentUser().then((res) => {
        this.currentUser = res.object;
      },(error) => {
        this.toast.create({
          message: "Benutzerinfo können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      })
    );
    promises.push(
      this.userDataService.getFriends().then((res) => {
        this.friends = res.object;
      },(error) => {
        this.toast.create({
          message: "Freunde können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      })
    );

    Promise.all(promises).then((res) => {
      this.userDataService.getAllUsers().then((res) => {
        this.allUsers = res.object.filter((u) => {
          return this.getAvailable(u);
        });
      }, (error) => {
        this.toast.create({
          message: "Benutzer können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      });
    });
  }

  viewProfile(friendId) {
    this.navCtrl.push('profile-details', {id: friendId});
  }
}
