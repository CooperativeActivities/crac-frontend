import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {UserDataService} from "../../services/user_service";
import _ from "lodash"

@IonicPage({
  name: "my-friends",
})
@Component({
  selector: 'page-my-friends',
  templateUrl: 'my-friends.html',
  providers: [UserDataService]
})
export class MyFriendsPage {
  friends: Array<any> = [];
  allUsers: Array<any> = [];
  userList: Array<any> = [];
  befriendedUsers: any = {};
  currentUser: any;

  constructor(public userDataService: UserDataService, public navCtrl: NavController, public toast: ToastController) {
    this.doRefresh();
  }


  getAvailable(userId) {
    return userId && (!this.befriendedUsers[userId]) && userId !== this.currentUser.id;
  }

  filterUsers(ev:any) {
    // set val to the value of the searchbar
    const val = ev ? ev.target.value: null;
    let list = this.allUsers

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      list = list.filter((item) => {
        const name = item.firstName + " " + item.lastName;
        return (name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    this.userList = list.filter(item => {
      return this.getAvailable(item.id)
    })
  }

  befriend(user){
    if(!this.getAvailable(user.id)){
      this.toast.create({
        message: `Bereits befreundet mit ${user.firstName} ${user.lastName} bzw. Freundschaftsanfrage bereits versandt.`,
        position: 'top',
        duration: 2000
      }).present();
      return
    }

    this.befriendedUsers[user.id] = true

    this.userDataService.friendRequest(user.id).then(res => {
      this.toast.create({
        message: `Freundschaftsanfrage versandt an ${user.firstName} ${user.lastName}.`,
        position: 'top',
        duration: 3000
      }).present();
    }, error => {

      this.befriendedUsers[user.id] = false

      this.toast.create({
        message: "Freundschaftsanfrage fehlgeschlagen: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    })
  }

  async doRefresh(){
    let [ currentUserRes, friendsRes, allUsersRes ] = await Promise.all([
      this.userDataService.getCurrentUser().catch((error) => {
        this.toast.create({
          message: "Benutzerinfo können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      }),
      this.userDataService.getFriends().catch((error) => {
        this.toast.create({
          message: "Freunde können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      }),
      this.userDataService.getAllUsers().catch((error) => {
        this.toast.create({
          message: "Benutzer können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      }),
    ])
    this.currentUser = currentUserRes.object;
    this.friends = friendsRes.object;
    this.befriendedUsers = {}
    for(let friend of this.friends){
      this.befriendedUsers[friend.id] = true
    }
    this.allUsers = _.sortBy(allUsersRes.object, ["firstName", "lastName"])

    this.filterUsers(null)
  }

  viewProfile(friendId) {
    this.navCtrl.push('profile-details', {id: friendId});
  }
}
