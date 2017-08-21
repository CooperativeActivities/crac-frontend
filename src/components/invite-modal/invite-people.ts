import { Component } from '@angular/core';
import {NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {UserDataService} from "../../services/user_service";

@Component({
  selector: 'invite-people',
  templateUrl: './invite-people.html',
  providers: [ UserDataService ]
})
export class InvitePeople {
  allUsers: Array<any> = [];
  userList: Array<any> = [];
  currentUser: any;
  initState: any;

  constructor(private viewCtrl: ViewController, public navCtrl: NavController, public params: NavParams,
              public userDataService: UserDataService, public toast: ToastController) {
    this.initState = {
      invites: this.params.get('invites') || [],
    };

    this.userDataService.getCurrentUser().then((res) => {
      this.currentUser = res.object;
      this.userDataService.getAllUsers().then((res) => {
        let invitedUsers = this.initState.invites;

        this.allUsers = res.object.filter((u) => {
          return this.getAvailable(u);
        });
        if(invitedUsers.length > 0) {
          for(let user of this.allUsers) {
            let inInvites = invitedUsers.findIndex((u) => {
              return u.id === user.id;
            });
            if(inInvites > -1) {
              user.checked = true;
            }
          }
        }

        this.userList = this.allUsers;
      }, (error) => {
        this.toast.create({
          message: "Benutzer konnten nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      });
    },(error) => {
      this.toast.create({
        message: "Benutzerinfo können nicht geladen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    })
  }

  getAvailable(user) {
    return user.id !== this.currentUser.id;
  }

  filterUsers(ev:any) {
    // Reset items back to all of the items
    this.userList = this.allUsers;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.userList = this.allUsers.filter((item) => {
        let name = item.firstName + " " + item.lastName;
        return (name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  invite(){
    let invites = this.allUsers.filter((u) => {
      return u.checked;
    });
    this.closeModal({invites: invites});
  }

  viewProfile(friendId) {
    this.navCtrl.push('profile-details', {id: friendId});
  }

  closeModal(params){
    this.viewCtrl.dismiss(params);
  }
}
