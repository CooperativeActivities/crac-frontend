import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import * as _ from 'lodash';

import { TaskDataService } from '../../services/task_service';
import { UserDataService } from "../../services/user_service";

@IonicPage({
  name: "task-edit",
})
@Component({
  selector: 'page-task-edit',
  templateUrl: 'task-edit.html',
  providers: [ TaskDataService, UserDataService ],
})
export class TaskEditPage {

  public taskId : any;
  public parentId : any;
  parentTask: any;
  task : any = {};
  isNewTask: boolean = true;
  isChildTask: boolean = false;
  addNewCompetence: boolean = false;
  addNewShift: boolean = false;
  addNewMaterial: boolean = false;
  pageTitle: string;
  competenceArea: any;
  competenceAreaList: Array<any> = [];
  availableCompetences: Array<any> = [];
  materials: any = {
    newObj: {},
    toAdd: [],
    toRemove: [],
    all: []
  };
  shifts:any = {
    newObj: {},
    toAdd: [],
    toRemove: [],
    all: []
  };
  competences: any = {
    newObj: {
      neededProficiencyLevel: 50
    },
    toAdd: [],
    toRemove: [],
    toUpdate: [],
    all: []
  };
  showDelete: boolean = false;
  showPublish: boolean = false;
  showUnpublish: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController, public alert: AlertController,
              public taskDataService: TaskDataService, public userDataService: UserDataService) {
    this.taskId = navParams.get("id");
    this.parentId = navParams.get("parentId");
    console.log(this.taskId);
    if(this.taskId !== undefined) {
      this.pageTitle = 'Aufgabe Bearbeiten';
      this.isNewTask = false;
      this.doRefresh();
    } else {
      this.isNewTask = true;
      this.task = {
        taskType: 'ORGANISATIONAL',
        taskCompetences: [],
        childTasks: [],
        materials: []
      }

      if (this.parentId) {
        this.isChildTask = true;
        this.pageTitle = "Unteraufgabe Erstellen";
        this.getParent();
      } else {
        this.isChildTask = false;
        this.pageTitle = "Aufgabe Erstellen";

        let now = new Date();
        now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        let str = this.getDateString(now);
        this.task.startTime = str;
      }
    }
  }

  getDateString(d){
    let tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num) {
        let norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return d.getFullYear() +
      '-' + pad(d.getMonth() + 1) +
      '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) +
      ':' + pad(d.getMinutes()) +
      ':' + pad(d.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }

  getParent(){
    let self = this;

    self.taskDataService.getTaskById(self.parentId).then(function(res){
      self.parentTask = res.object;
      self.task.startTime = self.getDateString(new Date( self.parentTask.startTime));
      self.task.endTime = self.getDateString(new Date (self.parentTask.endTime));
    },function(error){
      console.warn('Parent task could not be retrieved: ', error);
    });

  }

  resetObjects() {
    this.materials.newObj = {};
    this.materials.toAdd = [];
    this.materials.toRemove = [];
    this.shifts.newObj = {};
    this.shifts.toAdd = [];
    this.shifts.toRemove = [];
    this.competences.newObj = {
      neededProficiencyLevel: 50
    };
    this.competences.toAdd = [];
    this.competences.toRemove = [];
    this.competences.toUpdate = [];
  };

  updateFlags(){
    let self = this;

    let task = self.task;

    //initialize all flags to false
    self.showPublish =false;
    self.showUnpublish = false;
    self.showDelete = false;

    switch(task.taskState){
      case "COMPLETED":
        //disable all fields
        break;
      case "STARTED":
        self.showUnpublish = true;
        self.showDelete = true;
        break;
      case "PUBLISHED":
        self.showUnpublish = true;
        self.showDelete = true;
        break;
      case "NOT_PUBLISHED":
        self.showPublish = self.task.superTask === null;
        self.showDelete = true;
        break;
    }
  };

  openMap() {
    /* @TODO release this once map view is ready
    this.navCtrl.push('map-view',
      {
       id: this.taskId,
       address: this.task.address,
       lat: this.task.lat,
       lng: this.task.lng
     });
    */
  }

  getProcessedTaskData() {
    let self = this;
    let taskData : any = {};

    taskData.name = self.task.name;

    // @TODO: ensure that startTime/endTime are within startTime/endTime of superTask

    /* @TODO replace date check
     if(!angular.isDate(self.task.startTime)){
     toast.show("Aufgabe kann nicht gespeichert werden: " + "Bitte ein gültiges Startdatum eingeben!", 'top', false, 5000);
     return;
     }
     */

    /* @TODO replace date check*/
    if(self.task.endTime/* || !angular.isDate(self.task.endTime)*/) {
      self.task.startTime = new Date(self.task.startTime);
      self.task.endTime = new Date(self.task.startTime);
    } else {
      self.task.startTime = new Date(self.task.startTime);
      self.task.endTime = new Date(self.task.endTime);
    }

    if(self.task.startTime) taskData.startTime = self.task.startTime.getTime();
    if(self.task.endTime) taskData.endTime = self.task.endTime.getTime();
    if(self.task.description) taskData.description = self.task.description;
    if(self.task.location) taskData.location = self.task.location;
    if(self.task.address) taskData.address = self.task.address;
    if(self.task.lat) taskData.lat = self.task.lat;
    if(self.task.lng) taskData.lng = self.task.lng;
    if(self.task.minAmountOfVolunteers) taskData.minAmountOfVolunteers = self.task.minAmountOfVolunteers;
    taskData.taskType = self.task.taskType;
    taskData.taskState = self.task.taskState;

    return taskData;
  }

  create() {
    let self = this;

    let promises: Array<any> = [];
    if(!self.task.name){
      self.toast.create({
        message: "Aufgabe kann nicht gespeichert werden: " + "Name muss angegeben werden",
        duration: 3000,
        position: 'top'
      }).present();
      promises.push(new Promise((resolve) => {resolve(false)}));
      return promises;
    }

    let taskData = self.getProcessedTaskData();
    if (!self.parentTask) {
      promises.push(self.taskDataService.createNewTask(taskData));
    } else {
      promises.push(self.taskDataService.createNewSubTask(taskData, self.parentTask.id));
    }

    return promises;
  }

  save(promises) {
    let self = this;
    if(promises.length === 0) {
      return new Promise((resolve) => {resolve(false)});
    }
    let promise = Promise.all(promises).then(function (res) { return res; });
    return promise.then(function (res) {
      return res[0];
    }, function(error) {
      self.toast.create({
        message: "Aufgabe kann nicht gespeichert werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
      return new Promise((resolve) => {resolve(false)});
    });
  }

  update() {
    let self = this;
    let promises = [];
    if(!self.task.name){
      self.toast.create({
        message: "Aufgabe kann nicht gespeichert werden: " + "Name muss angegeben werden",
        duration: 3000,
        position: 'top'
      }).present();
      promises.push(new Promise((resolve) => {resolve(false)}));
      return promises;
    }

    let taskData = self.getProcessedTaskData();
    promises = [self.taskDataService.updateTaskById(taskData, self.task.id)];
    return promises;
  }

  save_details(task) {
    let self = this;
    let promises = [];

    let competencesToAdd = self.competences.toAdd.map(function(competence){
      return {
        competenceId: competence.id,
        importanceLevel: competence.neededProficiencyLevel || 0,
        neededProficiencyLevel: competence.neededProficiencyLevel || 0,
        mandatory: competence.mandatory ? 1 : 0
      }
    });
    let competencesToUpdate = self.competences.toUpdate.map(function(competence){
      return {
        id: competence.id,
        importanceLevel: parseInt(competence.neededProficiencyLevel) || 0,
        neededProficiencyLevel: parseInt(competence.neededProficiencyLevel) || 0,
        mandatory: competence.mandatory ? 1 : 0
      }
    });
    let shiftsToAdd = (self.shifts.toAdd).map(function(shift) {
      shift.startTime = new Date(shift.startTime);
      shift.endTime = new Date(shift.endTime);

      return {
        taskType: 'SHIFT',
        name: task.name,
        minAmountOfVolunteers: shift.minAmountOfVolunteers,
        startTime: shift.startTime.getTime(),
        endTime: shift.endTime.getTime()
      }
    });
    let materialsToAdd = (self.materials.toAdd).map(function(material){
      return {
        name: material.name,
        description: material.description || "",
        quantity: material.quantity || 0
      }
    });

    if(competencesToAdd.length > 0 ) {
      promises.push(self.taskDataService.addCompetencesToTask(task.id, competencesToAdd));
    }
    for(let i=0; i<competencesToUpdate.length; i++) {
      promises.push(self.taskDataService.updateTaskCompetence(task.id, competencesToUpdate[i]));
    }
    for(let i=0; i<self.competences.toRemove.length; i++) {
      promises.push(self.taskDataService.removeCompetenceFromTask(task.id, self.competences.toRemove[i]));
    }
    for(let i=0; i<self.shifts.toAdd.length; i++) {
      promises.push(self.taskDataService.createNewSubTask(shiftsToAdd[i], task.id));
    }
    for(let i=0; i<self.shifts.toRemove.length; i++) {
      promises.push(self.taskDataService.deleteTaskById(self.shifts.toRemove[i]));
    }
    if(materialsToAdd.length > 0 ) {
      promises.push(self.taskDataService.addMaterialsToTask(task.id, materialsToAdd));
    }
    for(let i=0; i<self.materials.toRemove.length; i++) {
      promises.push(self.taskDataService.removeMaterialFromTask(task.id, self.materials.toRemove[i]));
    }

    return promises;
  }

  save_changes() {
    let self = this;

    if(self.isNewTask) {
      self.save(self.create()).then(function(res:any) {
        if(!res) return;
        let task = res.object;
        self.toast.create({
          message: "Aufgabe erstellt",
          duration: 3000,
          position: 'top'
        }).present();

        self.save(self.save_details(task)).then(function (res:any) {
          self.navCtrl.push('task-detail', {id: task.id});
        });
      });
    } else {
      let promises = self.update().concat(self.save_details(self.task));
      self.save(promises).then(function(res:any) {
        if(!res) return;
        self.toast.create({
          message: "Aufgabe gespeichert",
          duration: 3000,
          position: 'top'
        }).present();
      });
    }
  };

  delete(){
    let self = this;

    let template = 'Wollen sie diese Aufgabe wirklich löschen? Es wird die Aufgabe mit ALLEN darunterliegenden Aufgabes permanent gelöscht.';
    if( self.task.taskState === 'PUBLISHED' )
      template += "<p><strong>Aufgabe ist schon veröffentlicht. Aufgabe trotzdem löschen?</strong></p>";
    if( self.task.taskState === 'STARTED' )
      template += "<p><strong>Aufgabe ist schon gestartet. Aufgabe trotzdem löschen?</strong></p>";

    self.alert.create({
      title: 'Löschen',
      message: template,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: () => {
            self.taskDataService.deleteTaskById(self.task.id).then(function (res) {
              self.toast.create({
                message: "Aufgabe gelöscht",
                position: 'top',
                duration: 3000
              }).present();
              if (self.task.superTask) {
                self.navCtrl.push('task-detail', {id: self.task.superTask.id});
              } else {
                self.navCtrl.push('my-tasks');
              }
            }, function (error) {
              self.toast.create({
                message: "Aufgabe kann nicht gelöscht werden: " + error.message,
                position: 'top',
                duration: 3000
              }).present();
            });
          }
        }
      ]
    }).present();
  };

  publish() {
    let self = this;

    if(self.task.taskType === 'ORGANISATIONAL'){
      if(self.task.childTasks.length <= 0){
        let message = "Übersicht hat noch keine Unteraufgabe! Bitte füge eine Unteraufgabe hinzu!";
        self.toast.create({
          message: "Task kann nicht veröffentlicht werden: " + message,
          position: 'top',
          duration: 3000
        }).present();
        return;
      }
    }

    let promises = self.update().concat(self.save_details(self.task));
    self.save(promises).then(function(res:any) {
      if(!res) return;
      self.taskDataService.changeTaskState(self.task.id, 'publish').then(function(res) {
        self.task.taskState = 'PUBLISHED';
        self.updateFlags();
        self.toast.create({
          message: "Aufgabe veröffentlicht",
          position: 'top',
          duration: 3000
        }).present();
      }, function(error) {
        self.toast.create({
          message: "Aufgabe kann nicht veröffentlicht werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      });
    }, function(error) {
      self.toast.create({
        message: "Aufgabe kann nicht veröffentlicht werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  };

  unpublish() {
    let self = this;

    let promises = self.update().concat(self.save_details(self.task));
    self.save(promises).then(function(res:any) {
      if(!res) return;
      self.taskDataService.changeTaskState(self.task.id, 'unpublish').then(function(res) {
        self.task.taskState = 'NOT_PUBLISHED';
        self.updateFlags();
        self.toast.create({
          message: "Aufgabe zurückgezogen",
          position: 'top',
          duration: 3000
        }).present();
        self.navCtrl.push('task-detail', {id: self.task.id});
      }, function(error) {
        self.toast.create({
          message: "Aufgabe kann nicht zurückgezogen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      });
    }, function(error) {
      self.toast.create({
        message: "Aufgabe kann nicht zurückgezogen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  };

  openNewCompetenceForm(){
    let self = this;
    if(self.competenceAreaList.length === 0) {
      self.getCompetenceAreas();
    }
    self.addNewCompetence = !self.addNewCompetence;
  }

  getCompetenceAreas() {
    let self = this;
    self.userDataService.getCompetenceAreas()
    .then(function (res) {
      if (res.object.length === 0) {
        self.toast.create({
          message: "Keine Kompetenzbereiche gefunden: " + res.message,
          position: 'top',
          duration: 3000
        }).present();
        return;
      }

      let compAreas = res.object;
      compAreas.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      self.competenceAreaList = compAreas;
    }, function (error) {
      self.toast.create({
        message: "Kompetenzbereiche können nicht geladen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  getCompetencesForArea(newValue){
    let self = this;

    if(newValue === -1) return;
    self.userDataService.getCompetencesForArea(newValue)
    .then(function(res) {
      if(res.object.mappedCompetences.length === 0) {
        self.toast.create({
          message: "Keine Kompetenzen in diesem Bereich gefunden",
          position: 'top',
          duration: 3000
        }).present();
        return;
      } else {
        self.availableCompetences = res.meta.competences;
      }
    }, function(error) {
      self.toast.create({
        message: "Kompetenzen dieses Bereichs können nicht geladen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  addCompetence(){
    let self = this;
    let competenceId = self.competences.newObj.id;
    if(!competenceId) return;
    //save later
    let index = _.findIndex(self.availableCompetences, { id: parseInt(competenceId) });
    if(index === -1){
      console.error("this shouldn't happen");
      return;
    }
    let competence = self.availableCompetences.splice(index, 1)[0];
    let newComp = {
      id: competenceId,
      name: competence.name,
      importanceLevel: self.competences.newObj.neededProficiencyLevel,
      neededProficiencyLevel: self.competences.newObj.neededProficiencyLevel,
      mandatory: self.competences.newObj.mandatory
    };

    self.competences.toAdd.push(newComp);
    self.competences.all.push(newComp);
  };

  updateCompetence(competence){
    let self = this;
    if(!competence) return;
    let index = _.findIndex(self.competences.toUpdate, {id: competence.id});
    if(index < 0) {
      self.competences.toUpdate.push(competence);
    } else {
      self.competences.toUpdate[index] = competence;
    }
  };

  removeCompetence(competence){
    let self = this;
    if(!competence) return;
    let index = _.findIndex(self.competences.all, competence);
    let newIndex = _.findIndex(self.competences.toAdd, competence);
    self.competences.all.splice(index, 1)[0];
    if(newIndex < 0) {
      self.competences.toRemove.push(competence.id);
    } else {
      self.competences.toAdd.splice(newIndex, 1)[0];
    }
  };

  openNewShiftForm(){
    let self = this;

    let start = self.task.startTime;
    let end = self.task.endTime || self.task.startTime;
    self.shifts.newObj.startTime = start;
    self.shifts.newObj.endTime = end;
    self.addNewShift = !self.addNewShift;
  }

  addShift() {
    let self = this;
    if(!self.shifts.newObj.minAmountOfVolunteers){
      let message = 'Bitte geben Sie die Anzahl an Helfer an!';
      self.toast.create({
        message: "Schicht konnte nicht hinzugefügt werden: " + message,
        position: 'top',
        duration: 3000
      }).present();
      return;
    }

    if(!self.shifts.newObj.startTime || !self.shifts.newObj.endTime) return;
    let newShift = _.clone(self.shifts.newObj);
    self.shifts.all.push(newShift);
    self.shifts.toAdd.push(newShift);
  };

  removeShift(shift) {
    let self = this;
    if (!shift) return;
    let index = _.findIndex(self.shifts.all, shift);
    let newIndex = _.findIndex(self.shifts.toAdd, shift);
    self.shifts.all.splice(index, 1)[0];
    if (newIndex < 0) {
      self.shifts.toRemove.push(shift.id);
    } else {
      self.shifts.toAdd.splice(newIndex, 1)[0];
    }
  }

  addMaterial(){
    let self = this;

    if(!self.materials.newObj.name || !self.materials.newObj.quantity) {
      let message = "Bitte geben Sie ";
      if(!self.materials.newObj.name) {
        message += "den Namen ";
      }
      if(!self.materials.newObj.quantity){
        if(!self.materials.newObj.name) {
          message += "und ";
        }
        message += "die Menge";
      }
      message += " an!";
      self.toast.create({
        message: "Material konnte nicht hinzugefügt werden: " + message,
        position: 'top',
        duration: 3000
      }).present();
      return;
    }

    //save later
    let newMaterial = _.clone(self.materials.newObj);
    newMaterial.quantity = newMaterial.quantity || 1;
    self.materials.all.push(newMaterial);
    self.materials.toAdd.push(newMaterial);
    self.materials.newObj = {};
  };

  removeMaterial(material){
    let self = this;
    if(!material) return;
    let index = _.findIndex(self.materials.all, material);
    let newIndex = _.findIndex(self.materials.toAdd, material);
    self.materials.all.splice(index, 1)[0];
    if(newIndex < 0) {
      self.materials.toRemove.push(material.id);
    } else {
      self.materials.toAdd.splice(newIndex, 1)[0];
    }
  };


  async doRefresh (refresher=null) {
    let self = this;
    await Promise.all([
      self.taskDataService.getTaskById(this.taskId).then((res) => {
        self.task = res.object;
        console.log(self.task);

        self.updateFlags();

        self.task.startTime = self.getDateString(new Date(self.task.startTime));
        if(self.task.startTime != self.task.endTime ){
          self.task.endTime = self.getDateString(new Date(self.task.endTime));
        }

        self.competences.all = _.clone(self.task.taskCompetences);
        self.materials.all = _.clone(self.task.materials);
        self.shifts.newObj.startTime = self.task.startTime;
        self.shifts.newObj.endTime = self.task.endTime;
        self.shifts.all = _.clone(self.task.childTasks);

        for(let i=0; i<self.shifts.all.length; i++) {
          self.shifts.all[i].startTime = new Date(self.shifts.all[i].startTime);
          self.shifts.all[i].endTime = new Date(self.shifts.all[i].endTime);
        }
      }, (error) => {
          self.toast.create({
            message:"Aufgabe kann nicht geladen werden: " + error.message,
            position: 'top',
            duration: 3000
          }).present();
      })
    ]);
    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete();
    }
  }

}

/*
    // Check if Address field has been updated on Map Page
    $scope.$on("$ionicView.enter", function(event, data){
      if (data.stateParams.address != null) {
        $scope.task.address = data.stateParams.address;
        $scope.task.lat = data.stateParams.lat;
        $scope.task.lng = data.stateParams.lng;
        console.log("Import Address: " + data.stateParams.address + " | lat: " + data.stateParams.lat + " / lng: " + data.stateParams.lng);
      }
    });

    $scope.load();
  }]);
*/
