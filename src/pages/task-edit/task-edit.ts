import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TaskDataService } from '../../services/task_service';

@IonicPage({
  name: "task-edit",
})
@Component({
  selector: 'page-task-edit',
  templateUrl: 'task-edit.html',
  providers: [ TaskDataService ],
})
export class TaskEditPage {

  public taskId : any;
  task : any;
  isNewTask: boolean = true;
  pageTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService) {
    this.taskId = navParams.get("id");
    console.log(this.taskId);
    if(this.taskId !== undefined) {
      this.pageTitle = 'Aufgabe Bearbeiten';
      this.isNewTask = false;
      //dorefresh
    } else {
      this.pageTitle = 'Aufgabe Erstellen';
      this.isNewTask = true;
      this.task = {
        taskType: 'ORGANISATIONAL'
      }
    }
  }

  async doRefresh (refresher=null) {
    var self = this;
    await Promise.all([
      self.taskDataService.getTaskById(this.taskId).then((res) => {
        self.task = res.object;
        console.log(self.task);
      }, (error) => {
        console.warn("Task could not be retrieved", error)
      })
    ]);
    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete();
    }
  }

}

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

    if($stateParams.id !== undefined) {
      $scope.isNewTask = false;
      $scope.taskId = $stateParams.id;
    }

    $scope.load = function(){
      if(!$scope.isNewTask){
        $scope.formTitle = "Aufgabe Bearbeiten";
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
      } else {
        if($stateParams.parentId !== ''){
          $scope.isChildTask = true;
          $scope.formTitle = "Unteraufgabe Erstellen";
        } else {
          $scope.isChildTask = false;
          $scope.formTitle = "Aufgabe Erstellen";
        }


        $scope.task.taskType = 'ORGANISATIONAL';
        $scope.timeChoice.choice = 'slot';
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

    // Save task
    $scope.save = function(){
      var task = $scope.task;
      var taskData = {};
      if(!task.name){
        ionicToast.show("Aufgabe kann nicht gespeichert werden: " + "Name muss angegeben werden", 'top', false, 5000);
        return;
      }
      taskData.name= task.name;

      // @TODO: ensure that startTime/endTime are within startTime/endTime of superTask


      if(!angular.isDate($scope.task.startTime)){
        ionicToast.show("Aufgabe kann nicht gespeichert werden: " + "Bitte ein gültiges Startdatum eingeben!", 'top', false, 5000);
        return;
      }

      if(!$scope.task.endTime || !angular.isDate($scope.task.endTime)) {
        task.startTime = new Date(task.startTime);
        task.endTime = new Date(task.startTime);
      } else {
        task.startTime = new Date(task.startTime);
        task.endTime = new Date(task.endTime);
      }


      if(task.startTime) taskData.startTime = task.startTime.getTime();
      if(task.endTime) taskData.endTime = task.endTime.getTime();
      if(task.description) taskData.description = task.description;
      if(task.location) taskData.location = task.location;
      if(task.address) taskData.address = task.address;
      if(task.lat) taskData.lat = task.lat;
      if(task.lng) taskData.lng = task.lng;
      if(task.minAmountOfVolunteers) taskData.minAmountOfVolunteers = task.minAmountOfVolunteers;
      taskData.taskType = task.taskType;

      var promise;
      if(!$scope.isNewTask){
        // @TODO: this shouldn't be necessary
        taskData.taskState = task.taskState;

        promise = $q.all([
          TaskDataService.updateTaskById(taskData, task.id)
        ]).then(function(res){
          return res;
        })
      } else {
        if (!$scope.parentTask) {
          promise = $q.all([
            TaskDataService.createNewTask(taskData)
          ]).then(function (res) {
            return res;
          });
        } else {
          promise = $q.all([
            TaskDataService.createNewSubTask(taskData, $scope.parentTask.id)
          ]).then(function (res) {
            return res;
          });
        }
      }

      return promise.then(function (res) {
        return res[0];
      }, function(error) {
        ionicToast.show("Aufgabe kann nicht gespeichert werden: " + error.message, 'top', false, 5000);
        return false;
      });
    };

    // Add details
    $scope.add_details = function() {
      $scope.save().then(function(save_res) {
        if (!save_res) return;
        var taskId = save_res.object.id;
        ionicToast.show("Aufgabe gespeichert", 'top', false, 5000);
        // redirect to the advanced edit page of the newly created workable task
        // (this could be handled even better, since backbutton now goes to the detail page of the parent, not of this task)
        $state.go('tabsController.taskEditAdv', {
          id: taskId,
          section: 'competences'
        }, {location: "replace"}).then(function (res) {
          $ionicHistory.removeBackView();
        });
      });
    }

    // Save changes only
    $scope.save_changes = function() {
      $scope.save().then(function(save_res) {
        if(!save_res) return;
        var taskId = save_res.object.id;
        ionicToast.show("Aufgabe gespeichert", 'top', false, 5000);

        if($scope.isNewTask) {
          // redirect all on save to the detail page. Clicking add detials button will take them to the new page
          // if($scope.task.taskType === 'ORGANISATIONAL') {
          // redirect to the edit page of the newly created org task
          // (this could be handled even better, since backbutton now goes to the detail page of the parent, not of this task)
          $state.go('tabsController.task', { id:taskId }, { location: "replace" }).then(function(res){
            $ionicHistory.removeBackView();
          });
          //}
        }
      });
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

    $scope.advancedEdit = function(section){
      $state.go('tabsController.taskEditAdv', { id: $scope.taskId, section: section });
    };

    // Open Leaflet Map //
    $scope.openMap = function() {
      $state.go('tabsController.openMap', { id: $scope.taskId, address: $scope.task.address, lat: $scope.task.lat, lng: $scope.task.lng});
    }

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
