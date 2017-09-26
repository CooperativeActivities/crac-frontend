import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, Content, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
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
  @ViewChild(Content) content: Content;

  task: any;
  timeChoice = 'slot';
  taskId: number;
  newComment = "";
  user: any;
  loaded: any;
  showPublish: boolean = false;
  showEnroll: boolean = false;
  showShifts: boolean = false;
  showCancel: boolean = false;
  showFollow: boolean = false;
  showUnfollow: boolean = false;
  showEvaluate: boolean = false;
  showTriggerEval: boolean = false;
  editableFlag: boolean = false;
  addSubTaskFlag: boolean = false;
  userIsDone: boolean = false;
  evaluation: any = null;
  showShiftsMaterialsEnroll: boolean = false;
  SUBTASKS_LIMITED_TO_SHALLOW: boolean = false;
  participationType: any;
  team: Array<any>;

  shiftsCardShown: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService,
              public userDataService: UserDataService, public toastCtrl: ToastController, public alert: AlertController,
              private authCtrl: AuthService, private elRef: ElementRef) {
    this.taskId = navParams.data.id;
    this.team = [];
    this.SUBTASKS_LIMITED_TO_SHALLOW = false;
    this.loaded = {};
    this.loaded.shifts = false;
  }

  ngOnInit(): void {
    this.loadUser()
  }


  ionViewDidEnter(){
    this.doRefresh();
  }

  edit() {
    this.navCtrl.push('task-edit', {id: this.taskId});
  }
  async loadUser(){
    try {
      const res = await this.userDataService.getCurrentUser()
      this.user = res.object;
    } catch(error){
      console.log(error);
      this.presentToast("Benutzerinformation kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
    }
  }

  async doRefresh(refresher = null) {
    let task = await this.taskDataService.getTaskById(this.taskId)
      .catch(e => {
        console.warn("Task could not be retrieved", e)
      });
    if(!this.user){ await this.loadUser() }
    if (task) {
      this.task = task.object;
      this.task.childTasks = _.orderBy(this.task.childTasks, ["startTime"]);
      if (this.task.userRelationships) {
        for(let member of this.task.userRelationships) {
          let newMember = this.team.find((tm) => {
            return tm.id === member.id
          });
          if(newMember === undefined) {
            newMember = member;
            newMember.isLeading = false;
            newMember.isParticipant = false;
            newMember.isFriend = false;
            this.team.push(newMember);
          }
          newMember.isLeading = newMember.isLeading || member.participationType === 'LEADING';
          newMember.isParticipant = newMember.isParticipant || member.participationType === 'PARTICIPATING';
          newMember.isFriend = newMember.isFriend || member.friend;

          let userId = this.user && this.user.id
          if(newMember.isLeading && newMember.id === userId) {
            this.participationType = 'LEADING';
          }
        }
        this.team =_.orderBy(this.team, [
          (rel => rel.isLeading ? 0 : 1),
          (rel => rel.isFriend ? 0 : 1),
          "name"
        ]);
      }
      this.task.materials = _.orderBy(this.task.materials, ["name"]).map(material => {
        material.subscribedQuantityOtherUsers =
          material.subscribedUsers
      // subscription.userId here
          .filter(subscription => subscription.userId !== this.user.id)
          .reduce((acc, val) => acc + val.quantity, 0)
        material.mySubscribedQuantity = material.subscribedQuantity - material.subscribedQuantityOtherUsers
        console.log(material)
        return material
      })
      // @TODO order by creationDate
      //this.task.comments = _.orderBy(this.task.comments, [ "name" ])

      if (this.task.startTime != this.task.endTime) this.timeChoice = 'slot';
      else this.timeChoice = 'point';

      if (this.task.participationDetails && this.task.participationDetails.length > 0) {
        this.participationType = this.task.participationDetails[0].participationType;
        this.userIsDone = this.task.participationDetails[0].completed;
        if(this.task.participationDetails[0].evaluation) {
          this.evaluation = this.task.participationDetails[0].evaluation;
        }
      } else {
        this.participationType = "NOT_PARTICIPATING";
        this.userIsDone = false;
      }
      this.loaded.shifts;
      this.updateFlags();

      console.log('current task', this.task);

    }
    //Stop the ion-refresher from spinning
    if (refresher) {
      refresher.complete()
    }
  }

  openShifts() {
    this.shiftsCardShown = true
    setTimeout(()=>{
      const elm = this.elRef.nativeElement.querySelector(".shiftsCard")
      if(elm) elm.scrollIntoView()
    })
  }

  openMapView() {
    // Open Leaflet Map View //
    this.navCtrl.push('map-view', {
      id: this.taskId,
      address: this.task.address,
      lat: this.task.geoLat,
      lng: this.task.geoLng
    });

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
    this.showShiftsMaterialsEnroll = false;
    this.showShifts = false;
    this.addSubTaskFlag = false;

    switch (task.taskState) {
      case "COMPLETED":
        if(relation === "LEADING") {
          this.showTriggerEval = true;
        }
        if(relation === "PARTICIPATING") {
          this.showEvaluate = this.evaluation === null || !this.evaluation.filled;
        }
        break;
      case "STARTED":
        if (userHasPermissions) {
          this.editableFlag = true;
        }
        if (relation === "LEADING") {
          // @TODO allow leaders to also participate/follow?
          this.showShiftsMaterialsEnroll = true;
          this.showShifts = taskHasShifts;
        } else {
          // @DISCUSS: cannot unfollow/cancel started task?
          this.showShiftsMaterialsEnroll = true;
          this.showEnroll = relation !== "PARTICIPATING" && !taskHasShifts && taskIsWorkable;
          this.showShifts = taskHasShifts;
          this.showFollow = relation !== "FOLLOWING" && relation !== "PARTICIPATING";
        }
        break;
      case "PUBLISHED":
        if (userHasPermissions) {
          this.editableFlag = true;
          this.addSubTaskFlag = this.task.taskType === 'ORGANISATIONAL' && (!this.SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask);
        }
        if (relation === "LEADING") {
          // @TODO allow leaders to also participate/follow
          this.showShiftsMaterialsEnroll = true;
          this.showShifts = taskHasShifts;
        } else {
          this.showShiftsMaterialsEnroll = true;
          this.showEnroll = relation !== "PARTICIPATING" && !taskHasShifts && taskIsWorkable;
          this.showShifts = taskHasShifts;
          this.showFollow = relation !== "FOLLOWING" && relation !== "PARTICIPATING";
          this.showCancel = relation === "PARTICIPATING";
          this.showUnfollow = relation === "FOLLOWING";
        }
        break;
      case "NOT_PUBLISHED":
        if (userHasPermissions) {
          this.editableFlag = true;
          this.showPublish = (this.task.superTask === null);
          this.addSubTaskFlag = this.task.taskType === 'ORGANISATIONAL' && (!this.SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask);
        }
        break;
    }

    this.content.resize();
  };

  //Publish a task
  publish() {
    console.log('publish');

    if (this.task.taskType === 'ORGANISATIONAL') {
      if (this.task.childTasks.length <= 0) {
        this.presentToast("Übersicht hat noch keine Unteraufgabe! Bitte füge eine Unteraufgabe hinzu!", 'top', false, 5000);
        return;
      }
    }

    if (!this.task.readyToPublish) {
      // @TODO - display popup with reason(s) why it's not ready
       var message = "";
       this.presentToast("Task kann nicht veröffentlicht werden: " + message, 'top', false, 5000)
      return;
    }

    let taskId = this.task.id;
    this.taskDataService.changeTaskState(taskId, 'publish').then( (res) => {
      this.presentToast("Task veröffentlicht", 'top', false, 5000);
      this.task.taskState = 'PUBLISHED';
      this.updateFlags();
    }, (error) => {
      this.presentToast("Aufgabe kann nicht veröffentlicht werden: " + error.message, 'top', false, 5000);
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
      let userRel = this.user;
      userRel.participationType = 'PARTICIPATING';
      if(this.participationType !== 'LEADING') {
        this.participationType = 'PARTICIPATING';
      }
      this.task.signedUsers++;
      this.task.userRelationships.push(userRel);
      let teamIdx = _.findIndex(this.team, {id: this.user.id});
      if(teamIdx > -1) {
        this.team[teamIdx].isParticipant = true;
      } else {
        userRel.isLeading = false;
        userRel.isParticipant = true;
        userRel.isFriend = false;
        this.team.push(userRel);
      }
      this.updateFlags();
    }, (error) => {
      this.presentToast("Aufgabe kann nicht übernommen werden: " + error.message, 'top', false, 5000);
    });
  };

  // Deleting all participating types
  cancel() {
    //failsafe, so you dont accidentally cancel leading a task
    if (this.participationType !== "LEADING") {
      this.taskDataService.removeOpenTask(this.task.id).then((res) => {
        console.log("cancelled");
        this.task.signedUsers--;
        this.participationType = "NOT_PARTICIPATING";
        let userIdx = _.findIndex(this.task.userRelationships, {id: this.user.id});
        if (userIdx > -1) {
          this.task.userRelationships.splice(userIdx, 1);
        }
        let teamIdx = _.findIndex(this.team, {id: this.user.id});
        if(teamIdx > -1) {
          if(!this.team[teamIdx].isLeading) {
            this.team.splice(teamIdx, 1);
          } else {
            this.team[teamIdx].isParticipant = false;
          }
        }
        this.updateFlags();
      }, function (error) {
        this.presentToast("Aufgabe kann nicht abgesagt werden: " + error.message, 'top', false, 5000);
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

  //unfollow a task
  unfollow() {
    this.taskDataService.removeOpenTask(this.task.id).then((res) => {
      console.log("unfollowed");
      this.participationType = "NOT_PARTICIPATING";
      let userIdx = _.findIndex(this.task.userRelationships, {id: this.user.id});
      if (userIdx > -1) {
        this.task.userRelationships.splice(userIdx, 1);
      }
      this.updateFlags();
    }, function (error) {
      this.presentToast("Aufgabe kann nicht abgesagt werden: " + error.message, 'top', false, 5000);
    });
  }

  //add self to a shift
  addToShift(shift) {
    this.taskDataService.changeTaskPartState(shift.id, 'participate').then((res) => {
      shift.assigned = true;
      let userRel = this.user;
      userRel.participationType = 'PARTICIPATING';
      shift.signedUsers++;
      shift.userRelationships.push(userRel);

      let alreadyInShift = _.find(this.task.childTasks, (task) => {
        return shift.id != task.id && task.assigned;
      });
      if (!alreadyInShift) {
        this.task.signedUsers++;
        this.task.userRelationships.push(userRel);
        let teamIdx = _.findIndex(this.team, {id: this.user.id});
        if(teamIdx > -1) {
          this.team[teamIdx].isParticipant = true;
        } else {
          userRel.isLeading = false;
          userRel.isParticipant = true;
          userRel.isFriend = false;
          this.team.push(userRel);
        }
      }
    }, (error) => {
      this.presentToast("Schicht kann nicht übernommen werden: " + error.message, 'top', false, 5000);
    });


  };

  //remove self from shift
  removeFromShift(shift) {
    this.taskDataService.removeOpenTask(shift.id).then((res) => {
      console.log('Not participating in shift ' + shift.id);
      shift.assigned = false;
      shift.signedUsers--;
      let shiftIdx = _.findIndex(shift.userRelationships, {id: this.user.id, participationType: 'PARTICIPATING'});
      if (shiftIdx > -1) {
        shift.userRelationships.splice(shiftIdx, 1);
      }

      let alreadyInShift = _.find(this.task.childTasks, (task) => {
        return (shift.id !== task.id) && task.assigned;
      });
      if (!alreadyInShift) {
        this.task.signedUsers--;
        let userIdx = _.findIndex(this.task.userRelationships, {id: this.user.id});
        if (userIdx > -1) {
          this.task.userRelationships.splice(userIdx, 1);
        }
        let teamIdx = _.findIndex(this.team, {id: this.user.id});
        if (teamIdx > -1) {
          if(!this.team[teamIdx].isLeading) {
            this.team.splice(teamIdx, 1);
          } else {
            this.team[teamIdx].isParticipant = false;
          }
        }
      }
    }, (error) => {
      this.presentToast("Die Zusage kann nicht nicht zurückgezogen werden: " + error.message, 'top', false, 5000);
    })
  };
  subscribeToMaterial(material){
    //save material subscription for any quantity. If zero, call unsubscribe, otherwise continue.
    if( material.mySubscribedQuantity === 0 ) {
      if(material.subscribedQuantityOtherUsers === material.subscribedQuantity) {
        return false;
      }
      this.unsubscribeFromMaterial(material);
      return
    }
    if( typeof material.mySubscribedQuantity !== "number" ) {
      this.presentToast("Menge ungültig. Menge muss eine Zahl sein.", 'top', false, 5000);
      return
    }
    if(material.mySubscribedQuantity < 0 || material.mySubscribedQuantity > (material.quantity - material.subscribedQuantityOtherUsers)){
      this.presentToast("Menge ungültig. Menge muss zwischen 0 und " + (material.quantity - material.subscribedQuantityOtherUsers) + " sein.", 'top', false, 5000);
      return
    }

    this.taskDataService.subscribeToMaterial(this.task.id, material.id, material.mySubscribedQuantity).then((res) => {
      console.log("Material subscribed");
      this.presentToast("Menge des Materials gespeichtert", 'top', false, 3000);
      material.subscribedQuantity = material.subscribedQuantityOtherUsers + material.mySubscribedQuantity;
    }, (error) => {
      this.presentToast("Materialien können nicht gespeichert werden: " + error.message, 'top', false, 3000);
    })

  }

  unsubscribeFromMaterial (material){
    this.taskDataService.unsubscribeFromMaterial(this.task.id, material.id).then((res) => {
      console.log("Material unsubscribed");
      this.presentToast("Menge des Materials gespeichtert", 'top', false, 3000);
      material.subscribedQuantity = material.subscribedQuantityOtherUsers + material.mySubscribedQuantity;
    }, (error) => {
      this.presentToast("Materialien können nicht gespeichert werden: " + error.message, 'top', false, 3000);
    });
  };

  getLeaders() {
    return this.task.userRelationships.filter((u) => {
      return u.participationType === 'LEADING';
    });
  }

  getParticipants() {
    return this.task.userRelationships.filter((u) => {
      return u.participationType === 'PARTICIPATING';
    });
  }

  areAllParticipantsDone() {
    for(let u of this.task.userRelationships) {
      if( u.participationType === "PARTICIPATING" && !u.completed ) {
        return false;
      }
    }
    return true;
  };

  //evaluations
  evaluate() {
    if(this.evaluation !== null) {
      this.navCtrl.push('evaluation-detail', {taskId: this.task.id, evalId: this.evaluation.id});
      return;
    }

    this.taskDataService.createEvaluationForUser(this.task.id).then((res) => {
      this.navCtrl.push('evaluation-detail', {taskId: this.task.id, evalId: res.object.id});
    }, (error) => {
      this.presentToast("Bewertung konnte nicht erstellt werden: " + error.message, 'top', false, 5000);
    });
  }

  triggerEval() {
    this.taskDataService.createEvaluationForAll(this.task.id).then((res) => {
      this.presentToast("Bewertungen erstellt und Nachrichten gesendet", 'top', false, 5000);
    }, (error) => {
      this.presentToast("Bewertungen konnten nicht erstellt werden: " + error.message, 'top', false, 5000);
    });
  }

  //Complete a task
  complete() {
    let allDone = this.areAllParticipantsDone();
    if(allDone) {
      this.completeTask('complete');
    } else {
      this.alert.create({
        title: "Task kann nicht als fertig markiert werden:",
        message: "Noch nicht alle Teilnehmer haben die Task als fertig markiert. Task trotzdem abschließen?",
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel'
          },
          {
            text: 'Abschließen',
            handler: () => {
              this.completeTask('forceComplete');
            }
          }
        ]
      }).present();
    }
  };

  completeTask(state) {
    if(!this.task.permissions) return false;

    this.taskDataService.changeTaskState(this.task.id, state).then((res) => {
      console.log("Task is completed");
      this.task.taskState = 'COMPLETED';
      this.updateFlags();
      console.log(res);
    }, (error) => {
      this.presentToast("Aufgabe kann nicht abgeschlossen werden: " + error.message, 'top', false, 5000);
    });
  };

  //Set a task as done
  done(){
    this.taskDataService.setTaskDone(this.task.id,"true").then((res) => {
      this.userIsDone = true;
    }, (error) => {
      this.presentToast("Aufgabe kann nicht als fertig markiert werden: " + error.message, 'top', false, 5000);
    });
  };

  //unset task as done
  notDone() {
    this.taskDataService.setTaskDone(this.task.id,"false").then((res) => {
      this.userIsDone = false;
    }, (error) => {
      this.presentToast("Aufgabe kann nicht gelost werden: " + error.message, 'top', false, 5000);
    });
  };

  makeNewSubTask() {
    this.navCtrl.push('task-edit', {parentId: this.task.id});
  }
}
