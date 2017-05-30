import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as _ from 'lodash';

import { TaskDataService } from '../../services/task_service';
import { UserDataService } from "../../services/user_service";
import {getProcessEnvVar} from "@ionic/app-scripts";

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
  public parentTask : any;
  task : any;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController,
              public taskDataService: TaskDataService, public userDataService: UserDataService) {
    this.taskId = navParams.get("id");
    this.parentTask = navParams.get("parentId");
    console.log(this.taskId);
    if(this.taskId !== undefined) {
      this.pageTitle = 'Aufgabe Bearbeiten';
      this.isNewTask = false;
      //dorefresh
    } else {
      this.isNewTask = true;
      this.task = {
        taskType: 'ORGANISATIONAL',
        taskCompetences: [],
        childTasks: [],
        materials: []
      }
      if (!this.parentTask) {
        this.isChildTask = true;
        this.pageTitle = "Unteraufgabe Erstellen";
      } else {
        this.isChildTask = false;
        this.pageTitle = "Aufgabe Erstellen";
      }
    }
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

    let promise = Promise.all(promises).then(function (res) { return res; });

    return promise.then(function (res) {
      return res[0];
    }, function(error) {
      self.toast.create({
        message: "Aufgabe kann nicht erstellt werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
      return new Promise((resolve) => {resolve(false)});
    });

  }

  save(promises) {
    let self = this;
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
      return {
        taskType: 'SHIFT',
        name: task.name,
        minAmountOfVolunteers: shift.minAmountOfVolunteers,
        startTime: shift.startTime.getTime(),
        endTime: shift.endTime.getTime()
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
      promises.push(self.taskDataService.deleteTaskById(self.shifts.toRemove[i].id));
    }
    return promises;
  }

  save_changes() {
    let self = this;

    if(self.isNewTask) {
      self.create().then(function(res:any) {
        if(!res) return;
        let task = res.object;
        self.toast.create({
          message: "Aufgabe gespeichert",
          duration: 3000,
          position: 'top'
        }).present();

        self.save(self.save_details(task)).then(function (res:any) {
          if(!res) return;
          self.navCtrl.push('task-details', {id: task.id});
          self.toast.create({
            message: "Aufgabe gespeichert",
            duration: 3000,
            position: 'top'
          }).present();
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

  addShift() {
    let self = this;
    if(self.shifts.newObj.minAmountOfVolunteers){
      var message = 'Bitte geben Sie die Anzahl an Helfer an!';
      self.toast.create({
        message: "Schicht konnte nicht hinzugefügt werden: " + message,
        position: 'top',
        duration: 3000
      }).present();
      return;
    }

    if(self.shifts.newObj.startTime || self.shifts.newObj.endTime) return;
    var newShift = _.clone(self.shifts.newObj);
    self.shifts.all.push(newShift);
    self.shifts.toAdd.push(newShift);
  };

  removeShift(shift) {
    let self = this;
    if (!shift) return;
    let index = _.findIndex(self.shifts.all, shift);
    var newIndex = _.findIndex(self.shifts.toAdd, shift);
    self.shifts.all.splice(index, 1)[0];
    if (newIndex < 0) {
      self.shifts.toRemove.push(shift.id);
    } else {
      self.shifts.toAdd.splice(newIndex, 1)[0];
    }
  }

  async doRefresh (refresher=null) {
    let self = this;
    await Promise.all([
      self.taskDataService.getTaskById(this.taskId).then((res) => {
        self.task = res.object;
        console.log(self.task);

        //self.updateFlags();

        self.task.startTime = new Date(self.task.startTime);
        self.task.endTime = new Date(self.task.endTime);

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
 $scope.updateFlags = function(){
 var task = $scope.task;

 //initialize all flags to false
 $scope.showPublish =false;

 switch(task.taskState){
 case "COMPLETED":
 //disable all fields
 break;
 case "STARTED":
 //disable all fields
 break;
 case "PUBLISHED":
 break;
 case "NOT_PUBLISHED":
 $scope.showPublish = $scope.task.superTask === null;
 break;
 }
 };


 var materialsToAdd = ($scope.materials.toAdd).map(function(material){
 return {
 name: material.name,
 description: material.description || "",
 quantity: material.quantity || 0
 }
 });

 // @TODO: implement time shift add - new endpoint for batch adding

 if(materialsToAdd.length > 0 ) {
 promises.push(TaskDataService.addMaterialsToTask(task.id, materialsToAdd));
 }
 for(var i=0; i<$scope.materials.toRemove.length; i++) {
 promises.push(TaskDataService.removeMaterialFromTask(task.id, $scope.materials.toRemove[i]));
 }

 $scope.save_and_publish = function(){
 $scope.save().then(function(save_res){
 if(!save_res) return;
 $scope.publish($scope.taskId);
 });
 };

 $scope.publish = function(taskId) {
 TaskDataService.changeTaskState(taskId, 'publish').then(function(res) {
 $state.go('tabsController.task', { id:taskId }, { location: "replace" }).then(function(res){
 $ionicHistory.removeBackView();
 });
 }, function(error) {
 ionicToast.show("Aufgabe kann nicht veröffentlicht werden: " + error.message, 'top', false, 5000);
 });
 };

 //material
 $scope.addMaterial = function(){
 if(!$scope.materials.newObj.name || !$scope.materials.newObj.quantity) {
 var message = "Bitte geben Sie ";
 if(!$scope.materials.newObj.name) {
 message += "den Namen ";
 }
 if(!$scope.materials.newObj.quantity){
 if(!$scope.materials.newObj.name) {
 message += "und ";
 }
 message += "die Menge";
 }
 message += " an!";
 ionicToast.show("Material konnte nicht hinzugefügt werden: " + message, 'top', false, 5000);
 return;
 }

 //save later
 var newMaterial = _.clone($scope.materials.newObj);
 newMaterial.quantity = newMaterial.quantity || 1;
 $scope.materials.all.push(newMaterial);
 $scope.materials.toAdd.push(newMaterial);
 $scope.materials.newObj = {};
 };
 $scope.removeMaterial = function(material){
 if(!material) return;
 var index = _.findIndex($scope.materials.all, material);
 var newIndex = _.findIndex($scope.materials.toAdd, material);
 $scope.materials.all.splice(index, 1)[0];
 if(newIndex < 0) {
 $scope.materials.toRemove.push(material.id);
 } else {
 $scope.materials.toAdd.splice(newIndex, 1)[0];
 }
 };

 TaskDataService.deleteTaskById(shift.id).then(function (res) {
 var message = 'Schicht wurde erfolgreich gelöscht';
 ionicToast.show("Schicht wurde gelöscht: " + message, 'top', false, 5000);
 }, function (error) {
 ionicToast.show("Schicht kann nicht gelöscht werden: " + error.message, 'top', false, 5000);
 });


 */

/*
cracApp.controller('taskEditCtrl', ['$scope','$route', '$stateParams','TaskDataService', '$ionicHistory', '$q', 'ionicToast', '$ionicPopup', '$state',
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,TaskDataService, $ionicHistory, $q, ionicToast, $ionicPopup, $state) {
    $scope.task= {};
    $scope.showPublish = false;
    $scope.showUnpublish = false;
    $scope.showDelete = false;
    $scope.isNewTask = true;
    $scope.formTitle = "";
    $scope.isChildTask = false;

    // ng-model only works properly with objects
    $scope.timeChoice = { choice: null }

    $scope.load = function(){
      if(!$scope.isNewTask){
        // @TODO: check if task.userIsLeading, if not, go back
        TaskDataService.getTaskById($scope.taskId).then(function (res) {
          var task = res.object;
          console.log("edit", task);
          if(!task) return;
          $scope.task = task;

          if($scope.task.startTime != $scope.task.endTime ){
            $scope.timeChoice.choice = 'slot';
            $scope.task.startTime = new Date($scope.task.startTime);
            $scope.task.endTime = new Date($scope.task.endTime);
          } else {
            $scope.timeChoice.choice = 'point';
            $scope.task.startTime = new Date($scope.task.startTime);
            $scope.task.endTime = new Date($scope.task.endTime);
          }

          $scope.updateFlags();
        }, function (error) {
          ionicToast.show("Aufgabe kann nicht geladen werden: " + error.message, 'top', false, 5000);
        });

        if($stateParams.parentId !== ""){
          TaskDataService.getTaskById($stateParams.parentId).then(function(res){
            $scope.parentTask = res.object;
            $scope.task.startTime = new Date( $scope.parentTask.startTime);
            $scope.task.endTime = new Date ($scope.parentTask.endTime);
          },function(error){
            console.warn('Parent task could not be retrieved: ', error);
          });
        } else {
          var now = new Date();
          now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
          now.setMinutes(0);
          now.setSeconds(0);
          now.setMilliseconds(0);
          $scope.task.startTime = now;
        }
      }
    };

    $scope.updateFlags = function(){
      var task = $scope.task;

      //initialize all flags to false
      $scope.showPublish =false;
      $scope.showUnpublish = false;
      $scope.showDelete = false;

      switch(task.taskState){
        case "COMPLETED":
          //disable all fields
          break;
        case "STARTED":
          $scope.showUnpublish = true;
          $scope.showDelete = true;
          break;
        case "PUBLISHED":
          $scope.showUnpublish = true;
          $scope.showDelete = true;
          break;
        case "NOT_PUBLISHED":
          $scope.showPublish = $scope.task.superTask === null;
          $scope.showDelete = true;
          break;
      }
    };



    $scope.save_and_publish = function(){

      console.log('save and publish');
      if($scope.task.taskType === 'ORGANISATIONAL'){
        if($scope.task.childTasks.length <= 0){
          var message = "Übersicht hat noch keine Unteraufgabe! Bitte füge eine Unteraufgabe hinzu!";
          ionicToast.show("Task kann nicht veröffentlicht werden: " + message, 'top', false, 5000);
          return;
        }
      }


      $scope.save().then(function(save_res){
        if(!save_res) return;
        var taskId = save_res.object.id;
        $scope.publish(taskId);
      })
    };

    $scope.save_and_unpublish = function(){
      $scope.save().then(function(save_res){
        if(!save_res) return;
        $scope.unpublish();
      })
    };

    $scope.unpublish = function() {
      TaskDataService.changeTaskState($scope.taskId, 'unpublish').then(function(res) {
        $scope.task.taskState = 'NOT_PUBLISHED';
        $scope.updateFlags();
        ionicToast.show("Aufgabe zurückgezogen", 'top', false, 5000);
        $state.go('tabsController.task', { id: $scope.taskId }, { location: 'replace' }).then(function(res) {
          $ionicHistory.removeBackView();
        });
      }, function(error) {
        ionicToast.show("Aufgabe kann nicht zurückgezogen werden: " + error.message, 'top', false, 5000);
      });
    };

    $scope.publish = function(taskId) {
      TaskDataService.changeTaskState(taskId, 'publish').then(function(res) {
        $scope.task.taskState = 'PUBLISHED';
        $scope.updateFlags();
        ionicToast.show("Aufgabe veröffentlicht", 'top', false, 5000);
        $state.go('tabsController.task', { id:taskId }, { location: "replace" }).then(function(res){
          $ionicHistory.removeBackView()
        });
      }, function(error) {
        if($scope.isNewTask) {
          ionicToast.show("Aufgabe wurde erstellt, kann aber nicht veröffentlicht werden.\n" + message, 'top', false, 5000)
          setTimeout(function(e) {
            // redirect to the edit page of the newly created task
            // (this could be handled even better, since backbutton now goes to the detail page of the parent, not of this task)
            $state.go('tabsController.taskEdit', { id:taskId }, { location: "replace" }).then(function(res){
              $ionicHistory.removeBackView()
            });
          }, 5000)
        } else {
          ionicToast.show("Aufgabe kann nicht veröffentlicht werden: " + error.message, 'top', false, 5000);
        }
      });
    };

    $scope.delete = function(){
      var template = 'Wollen sie diese Aufgabe wirklich löschen? Es wird die Aufgabe mit ALLEN darunterliegenden Aufgabes permanent gelöscht.';
      if( $scope.task.taskState === 'PUBLISHED' )
        template += "<p><strong>Aufgabe ist schon veröffentlicht. Aufgabe trotzdem löschen?</strong></p>";
      if( $scope.task.taskState === 'STARTED' )
        template += "<p><strong>Aufgabe ist schon gestartet. Aufgabe trotzdem löschen?</strong></p>";

      var confirmPopup = $ionicPopup.confirm({
        title: 'Löschen',
        template: template,
        okText: "Löschen",
        okType: "button-assertive",
        cancelText: "Abbrechen"
      });

      confirmPopup.then(function(res) {
        if(res) {
          TaskDataService.deleteTaskById($scope.task.id).then(function(res) {
            ionicToast.show("Aufgabe gelöscht", 'top', false, 5000);
            if($scope.task.superTask) {
              $state.go('tabsController.task', {id: $scope.task.superTask.id}, {location: "replace"})
                .then(function (res) {
                  $ionicHistory.removeBackView();
                });
            } else {
              $state.go('tabsController.myTasks', {location: "replace"})
                .then(function (res) {
                  $ionicHistory.removeBackView();
                });
            }
          }, function(error) {
            ionicToast.show("Aufgabe kann nicht gelöscht werden: " + error.message, 'top', false, 5000);
          });
        }
      });
    };

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
