import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import * as _ from 'lodash';

import {TaskDataService} from '../../services/task_service';
import {AuthService} from '../../services/auth_service';
import {UserDataService} from "../../services/user_service";

@IonicPage({
  name: "task-detail",
})
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
  providers: [TaskDataService, UserDataService],
})
export class TaskDetailPage {

  task: any;
  timeChoice = 'slot';
  taskId: number;
  newComment = "";
  user: any;
  loaded: any;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService,
              public userDataService: UserDataService, public toastCtrl: ToastController, private authCtrl: AuthService) {
    this.taskId = navParams.data.id;
    this.SUBTASKS_LIMITED_TO_SHALLOW = false;
    this.loaded = {};
    this.loaded.shifts = false;
  }

  ngOnInit(): void {
    let that = this;
    this.userDataService.getCurrentUser().then((res) => {
      that.user = res.object;
    }).catch((error)=>{
      console.log(error);
      that.presentToast("Benutzerinformation kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
    })
  }


  ionViewDidEnter(){
    this.doRefresh();
    this.adjustFooter();
  }

  edit() {
    this.navCtrl.push('task-edit', {id: this.taskId});
  }

  async doRefresh(refresher = null) {
    let that = this;
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
      that.loaded.shifts;
      this.updateFlags();

      console.log('current task', this.task);

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
    if (this.loaded.shifts) return;
    let that = this;
    for (let i = 0; i < this.task.childTasks.length; i++) {
      this.taskDataService.getTaskById(this.task.childTasks[i].id).then(function (res) {
        console.log('child shift', res);
        let shift = _.findIndex(that.task.childTasks, {id: res.object.id});
        that.task.childTasks[shift] = res.object;
      }, function (error) {
        this.presentToast("Schichtinformation konnte nicht geladen werden: " + error.message, 'top', false, 5000);
      });
    }
    this.loaded.shifts = true;
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
      });
    if (comment) {
      console.log("comment added", comment);
      this.newComment = "";
      this.task.comments.push(comment.object)
      //@TODO we should not need to refresh the whole task to add/remove comments
      //this.doRefresh();
    }
  }

  updateFlags() {
    let task = this.task;
    let userHasPermissions = task.permissions;
    let relation = this.participationType;
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
    let that = this;
    console.log('publish');

    if (this.task.taskType === 'ORGANISATIONAL') {
      if (this.task.childTasks.length <= 0) {
        that.presentToast("Übersicht hat noch keine Unteraufgabe! Bitte füge eine Unteraufgabe hinzu!", 'top', false, 5000);
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
      that.presentToast("Task veröffentlicht", 'top', false, 5000);
      that.showPublish = false;
    }, function (error) {
      that.presentToast("Aufgabe kann nicht veröffentlicht werden: " + error.message, 'top', false, 5000);
    });
  };

  //Enroll for a task
  enroll() {
    if (this.task.taskType === 'WORKABLE' && this.task.childTasks.length > 0) {
      //if a task has shifts, general enrolment is forbidden, this shouldn't happen
      return;
    }

    this.taskDataService.changeTaskPartState(this.taskId, 'participate').then( (res) => {
      //this.task = res.object
      this.participationType = "PARTICIPATING";
      this.task.signedUsers++;
      this.task.userRelationships.push(this.user);
      this.updateFlags();
    }, (error) => {
      this.presentToast("An der Aufgabe kann nicht teilgenommen werden: " + error.message, 'top', false, 5000);
    });
  };

  // Deleting all participating types
  cancel() {
    let that = this;
    //failsafe, so you dont accidentally cancel leading a task
    if (this.participationType !== "LEADING") {
      this.taskDataService.removeOpenTask(that.task.id).then(function (res) {
        console.log("unfollowed/cancelled");
        that.participationType = "NOT_PARTICIPATING";
        that.task.signedUsers--;
        let userIdx = _.findIndex(that.task.userRelationships, {id: that.user.id});
        if (userIdx > -1) {
          that.task.userRelationships.splice(userIdx, 1);
        }
        that.updateFlags();
      }, function (error) {
        that.presentToast("Aufgabe kann nicht abgesagt werden: " + error.message, 'top', false, 5000);
      });
    }
  };

  // follow a task
  follow() {
    let that = this;
    this.taskDataService.changeTaskPartState(this.task.id, 'follow').then(function (res) {
      that.participationType = "FOLLOWING";
      that.updateFlags();
    }, function (error) {
      that.presentToast("Aufgabe kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
    });
  };

  //add self to a shift
  addToShift(shift) {
    let that = this;
    console.log('shift', shift);
    this.taskDataService.changeTaskPartState(shift.id, 'participate').then(function (res) {

      shift.assigned = true;
      shift.signedUsers++;
      shift.userRelationships.push(that.user);

      let alreadyInShift = _.find(that.task.childTasks, function (task) {
        return shift.id != task.id && task.assigned;
      });
      if (!alreadyInShift && that.participationType != 'PARTICIPATING') {
        that.task.signedUsers++;
        that.task.userRelationships.push(that.user);
      }
    }, function (error) {
      that.presentToast("An der Schicht kann nicht teilgenommen werden: " + error.message, 'top', false, 5000);
    });


  };

  //remove self from shift
  removeFromShift(shift) {
    let that = this;
    this.taskDataService.removeOpenTask(shift.id).then(function (res) {
      console.log('Not participating in shift ' + shift.id);
      shift.assigned = false;
      shift.signedUsers--;
      let shiftIdx = _.findIndex(shift.userRelationships, {id: that.user.id});
      if (shiftIdx > -1) {
        shift.userRelationships.splice(shiftIdx, 1);
      }

      let alreadyInShift = _.find(that.task.childTasks, function (task) {
        return shift.id !== task.id && task.assigned;
      });
      if (!alreadyInShift && that.participationType != 'PARTICIPATING') {
        this.task.signedUsers--;
        let userIdx = _.findIndex(that.task.userRelationships, {id: that.user.id});
        if (userIdx > -1) {
          that.task.userRelationships.splice(userIdx, 1);
        }
      }
      that.task.signedUsers--;
    }, function (error) {
      that.presentToast("Die Zusage kann nicht nicht zurückgezogen werden: " + error.message, 'top', false, 5000);
    });

  };

  adjustFooter() {

    let fh = document.querySelector('ion-footer').clientHeight;
    let sc = document.querySelectorAll('.scroll-content');
    fh = (fh + 56);

    if (sc != null) {
      Object.keys(sc).map((key) => {
        sc[key].style.marginBottom = fh + 'px';
      });
    }
  };

  makeNewSubTask() {
    this.navCtrl.push('task-edit', {parentId: this.task.id});
    // this.go('tabsController.newTask', { parentId: $scope.task.id });
  }

  ionViewWillLeave() {
    let fh = 0;
    let sc = document.querySelectorAll('.scroll-content');
    fh = (fh + 56);

    if (sc != null) {
      Object.keys(sc).map((key) => {
        sc[key].style.marginBottom = fh + 'px';
      });
    }
  }


}
