import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import * as _ from 'lodash';

import { UserDataService } from "../../services/user_service";
import {TaskDataService} from "../../services/task_service";

@IonicPage({
  name: "messages",
})
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  providers: [ UserDataService, TaskDataService ],
})
export class MessagesPage {

  notifications: Array<any> = [];

  constructor(public navCtrl: NavController, public userDataService: UserDataService,
              public taskDataService: TaskDataService, public toast: ToastController) {
    this.onReload();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

  getVisibleNotifications(n) {
    return n.name === 'Friend Request' || n.name === 'Evaluation';
  }

  evaluate(notification) {
    this.navCtrl.push('evaluation-detail', {taskId: notification.taskId, evalId: notification.evaluationId});
  }

  accept(notification){
    this.userDataService.acceptNotification(notification.notificationId).then(() => {
      let index = _.findIndex(this.notifications, {id: notification.notificationId});
      this.notifications.splice(index, 1)[0];
    }, (error) => {
      this.toast.create({
        message: "Nachrichten konnte nicht zugestimmt werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
    });
  }

  decline(notification){
    this.userDataService.declineNotification(notification.notificationId).then(() => {
      let index = _.findIndex(this.notifications, {id: notification.notificationId});
      this.notifications.splice(index, 1)[0];
    }, (error) => {
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
        if(notification.name == "Friend Request"){
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
