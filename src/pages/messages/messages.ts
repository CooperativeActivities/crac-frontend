import { Component } from '@angular/core';
import {Events, IonicPage, NavController, ToastController} from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public events: Events, public toast: ToastController,
              public userDataService: UserDataService, public taskDataService: TaskDataService) {}

  ionViewDidEnter() {
    this.onReload();
  }

  getVisibleNotifications(n) {
    return n.name === 'Friend Request' || n.name === 'Evaluation' || n.name === 'Task Invitation';
  }

  evaluate(notification) {
    this.navCtrl.push('evaluation-detail', {taskId: notification.taskId, evalId: notification.evaluationId});
  }

  joinTask(notification) {
    this.userDataService.acceptNotification(notification.notificationId).then(() => {
      this.removeNotification(notification);
      this.toast.create({
        message: "Aufgabe teilgenommen",
        duration: 3000,
        position: 'top'
      }).present();
      this.navCtrl.push('task-detail', {id: notification.taskId});
    }, (error) => {
      this.toast.create({
        message: "An der Aufgabe kann nicht teilgenommen werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
    });
  }

  viewProfile(userId, notificationId) {
    this.navCtrl.push('profile-details', {id: userId, friendRequest: notificationId});
  }

  viewTask(taskId, notificationId) {
    this.navCtrl.push('task-detail', {id: taskId, invite: notificationId})
  }

  accept(notification){
    this.userDataService.acceptNotification(notification.notificationId).then(() => {
      this.removeNotification(notification);
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
      this.removeNotification(notification);
    }, (error) => {
      this.toast.create({
        message: "Nachrichten konnte nicht abgelehnt werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
    });
  }

  removeNotification(n) {
    let index = _.findIndex(this.notifications, {id: n.notificationId});
    this.notifications.splice(index, 1)[0];
    this.events.publish('notification:remove');
  }

  onReload() {
    this.userDataService.getNotification().then((res) => {
      let notifications = res.object;
      if(notifications.length === 0) {
        this.notifications = notifications.filter(this.getVisibleNotifications);
        this.events.publish('notification:update', this.notifications.length);
        return [new Promise((resolve) => {resolve(false)})];
      }
      let promises = [];
      notifications.forEach((notification) => {
        if(notification.name == "Friend Request"){
          promises.push(this.userDataService.getUserById(notification.senderId).then((res) => {
            notification.user = res.object
          }))
        }
      });
      return Promise.all(promises).then(() => {
        this.notifications = notifications.filter(this.getVisibleNotifications);
        this.events.publish('notification:update', this.notifications.length);
      });
    }, (error) => {
      this.toast.create({
        message: "Nachrichten konnte nicht geladen werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
    });
  }
}
