import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import * as _ from 'lodash';

import {TaskDataService} from '../../services/task_service';
import {AuthService} from '../../services/auth_service';

@IonicPage({
  name: "task-detail",
})
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
  providers: [TaskDataService],
})
export class TaskDetailPage {

  task: any;
  timeChoice = 'slot';
  taskId: number;
  newComment = "";
  showPublish: boolean = false;
  showEnroll: boolean = false;
  showCancel: boolean = false;
  showFollow: boolean = false;
  showUnfollow: boolean = false;
  editableFlag: boolean = false;
  addSubTaskFlag: boolean = false;
  userIsDone: boolean = false;
  showShiftsMaterialsEnroll: boolean = false;
  SUBTASKS_LIMITED_TO_SHALLOW: boolean = false;
  participationType: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService, public toastCtrl: ToastController, private authCtrl: AuthService) {
    this.taskId = navParams.data.id;
    this.SUBTASKS_LIMITED_TO_SHALLOW = false;
    this.doRefresh();

  }

  edit() {
    this.navCtrl.push('task-edit', {id: this.taskId});
  }

  async doRefresh(refresher = null) {
    let task = await this.taskDataService.getTaskById(this.taskId)
      .catch(e => {
        console.warn("Task could not be retrieved", e)
      });
    if (task) {
      this.task = task.object;
      this.task.childTasks = _.orderBy(this.task.childTasks, ["startTime"]);
      if (this.task.userRelationships) this.task.userRelationships = _.orderBy(this.task.userRelationships, [(rel => (rel.friend || rel.participationType === "LEADING") ? 0 : 1), "name"]);
      this.task.materials = _.orderBy(this.task.materials, ["name"]);
      // @TODO order by creationDate
      //this.task.comments = _.orderBy(this.task.comments, [ "name" ])

      if (this.task.startTime != this.task.endTime) this.timeChoice = 'slot';
      else this.timeChoice = 'point';

      if (this.task.participationDetails) {
        this.participationType = this.task.participationDetails[0].participationType;
        this.userIsDone = this.task.participationDetails[0].completed;
      } else {
        this.participationType = "NOT_PARTICIPATING";
        this.userIsDone = false;
      }
      this.updateFlags();


    }
    //Stop the ion-refresher from spinning
    if (refresher) {
      refresher.complete()
    }
  }

  openMapView() {
    // Open Leaflet Map View //
    this.navCtrl.push('map-view', {
      id: this.taskId,
      address: this.task.address,
      lat: this.task.lat,
      lng: this.task.lng
    });
    //$state.go('tabsController.openMapView', { id: $scope.taskId, address: $scope.task.address, lat: $scope.task.lat, lng: $scope.task.lng});

  }

  loadShifts() {
    for (let i = 0; i < this.task.childTasks.length; i++) {
      let that = this;
      this.taskDataService.getTaskById(this.task.childTasks[i].id).then(function (res) {
        console.log('child shift', res);
        let shift = _.findIndex(that.task.childTasks, {id: res.object.id});
        that.task.childTasks[shift] = res.object;
      }, function (error) {
        this.presentToast("Schichtinformation konnte nicht geladen werden: " + error.message, 'top', false, 5000);
      });
    }
  }

  presentToast(msg, position, closeButton, duration) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position,
      showCloseButton: closeButton
    });
    toast.present();
  }

  //Add a new comment to the task
  async addNewComment() {
    //don't add comment if it is empty
    if (!this.newComment) return false;
    let newComment = {
      content: this.newComment,
      name: this.authCtrl.user.name,
    };

    let comment = await this.taskDataService.addComment(this.taskId, newComment)
      .catch(error => {
        this.presentToast("Kommentar kann nicht hinzufügen werden: " + error.message, 'top', false, 5000);
      })
    if (comment) {
      console.log("comment added", comment);
      this.newComment = ""
      this.task.comments.push(comment.object)
      //@TODO we should not need to refresh the whole task to add/remove comments
      //this.doRefresh();
    }
  }

  updateFlags() {
    let task = this.task;
    let userHasPermissions = task.permissions;
    let relation = task.participationType;
    let taskIsWorkable = task.taskType === 'WORKABLE';
    let taskHasShifts = task.childTasks.length > 0 && taskIsWorkable;
    let taskIsSubtask = !!task.superTask;

    //initialize all flags to false
    this.showPublish = false;
    this.showEnroll = false;
    this.showCancel = false;
    this.showFollow = false;
    this.showUnfollow = false;
    this.editableFlag = false;
    this.userIsDone = false;
    this.showShiftsMaterialsEnroll = false;
    this.addSubTaskFlag = false;

    switch (task.taskState) {
      case "COMPLETED":
        break;
      case "STARTED":
        if (userHasPermissions) {
          this.editableFlag = true;
        }
        if (relation === "LEADING") {
          // @TODO allow leaders to also participate/follow?
        } else {
          // @DISCUSS: cannot unfollow started task?
          this.showShiftsMaterialsEnroll = true;
          this.showEnroll = relation !== "PARTICIPATING" && !taskHasShifts;
          this.showFollow = relation !== "FOLLOWING" && relation !== "PARTICIPATING";
          this.showCancel = relation === "PARTICIPATING";
        }
        break;
      case "PUBLISHED":
        if (userHasPermissions) {
          this.editableFlag = true;
          this.addSubTaskFlag = this.task.taskType === 'ORGANISATIONAL' && (!this.SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask);
          this.editableFlag = true;
        }
        if (relation === "LEADING") {
          // @TODO allow leaders to also participate/follow
        } else {
          this.showShiftsMaterialsEnroll = true;
          this.showEnroll = relation !== "PARTICIPATING" && !taskHasShifts;
          this.showFollow = relation !== "FOLLOWING" && relation !== "PARTICIPATING";
          this.showCancel = relation === "PARTICIPATING";
          this.showUnfollow = relation === "FOLLOWING";
        }
        break;
      case "NOT_PUBLISHED":
        if (userHasPermissions) {
          this.editableFlag = true;
          this.showPublish = true;
          this.addSubTaskFlag = this.task.taskType === 'ORGANISATIONAL' && (!this.SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask);
        }
        break;
    }
  };

  //Publish a task
  publish() {
    console.log('publish');
    if (this.task.taskType === 'ORGANISATIONAL') {
      if (this.task.childTasks.length <= 0) {
        this.presentToast("Übersicht hat noch keine Unteraufgabe! Bitte füge eine Unteraufgabe hinzu!", 'top', false, 5000);
      }
    }

    if (!this.task.readyToPublish) {
      // @TODO - display popup with reason(s) why it's not ready
      /*
       var message = "";
       ionicToast.show("Task kann nicht veröffentlicht werden: " + message, 'top', false, 5000)*/
      return;
    }

    let taskId = this.task.id;
    this.taskDataService.changeTaskState(taskId, 'publish').then(function (res) {
      this.presentToast("Task veröffentlicht", 'top', false, 5000);
      this.showPublish = false;
    }, function (error) {
      this.presentToast("Aufgabe kann nicht veröffentlicht werden: " + error.message, 'top', false, 5000);
    });
  };

  //Enroll for a task
  enroll() {
    if (this.task.taskType === 'WORKABLE' && this.task.childTasks.length > 0) {
      //if a task has shifts, general enrolment is forbidden, this shouldn't happen
      return;
    }

    this.taskDataService.changeTaskPartState(this.taskId, 'participate').then(function (res) {
      this.participationType = "PARTICIPATING";
      this.task.signedUsers++;
      this.task.userRelationships.push(this.user);
      this.updateFlags();
    }, function (error) {
      this.presentToast("An der Aufgabe kann nicht teilgenommen werden: " + error.message, 'top', false, 5000);
    });
  };

  // Deleting all participating types
  cancel() {
    //failsafe, so you dont accidentally cancel leading a task
    if (this.participationType !== "LEADING") {
      this.taskDataService.removeOpenTask(this.task.id).then(function (res) {
        console.log("unfollowed/cancelled");
        this.participationType = "NOT_PARTICIPATING";
        this.task.signedUsers--;
        let userIdx = _.findIndex(this.task.userRelationships, {id: this.user.id});
        if (userIdx > -1) {
          this.task.userRelationships.splice(userIdx, 1);
        }
        this.updateFlags();
      }, function (error) {
        this.presentToast("Aufgabe kann nicht abgesagt werden: " + error.message, 'top', false, 5000);
      });
    }
  };

  // follow a task
  follow() {
    this.taskDataService.changeTaskPartState(this.task.id, 'follow').then(function (res) {
      this.participationType = "FOLLOWING";
      this.updateFlags();
    }, function (error) {
      this.presentToast("Aufgabe kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
    });
  };


}
