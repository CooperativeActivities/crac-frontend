import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import * as _ from 'lodash';

import { UserDataService } from "../../services/user_service";

@IonicPage({
  name: "messages",
})
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  providers: [ UserDataService ],
})
export class MessagesPage {

  notifications: Array<any> = [];

  constructor(public navCtrl: NavController, public userDataService: UserDataService) {
    this.onReload();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

  accept(notification){
    let self = this;

    console.log(notification);
    self.userDataService.acceptNotification(notification.notificationId).then(function(){
      let index = _.findIndex(self.notifications, {id: notification.notificationId});
      self.notifications.splice(index, 1)[0];
    }, function(error) {
      this.toast.create({
        message: "Nachrichten konnte nicht zugestimmt werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
    });
  }

  decline(notification){
    let self = this;

    self.userDataService.declineNotification(notification.notificationId).then(function(){
      let index = _.findIndex(self.notifications, {id: notification.notificationId});
      self.notifications.splice(index, 1)[0];
    }, function(error) {
      this.toast.create({
        message: "Nachrichten konnte nicht abgelehnt werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
    });
  }
  onReload() {
    let self = this;

    self.userDataService.getNotification().then(function(res){
      let notifications = res.object;
      if(notifications.length === 0) {
        return [new Promise((resolve) => {resolve(false)})];
      }
      let promises = [];
      notifications.forEach(function(notification){
        if(notification.name = "Friend Request"){
          promises.push(self.userDataService.getUserById(notification.senderId).then(function(res){
            notification.user = res.object
          }))
        }
      });
      return Promise.all(promises).then(function(){
        self.notifications = notifications
      });
    }, function(error) {
      this.toast.create({
        message: "Nachrichten konnte nicht geladen werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
    });
  }
}
