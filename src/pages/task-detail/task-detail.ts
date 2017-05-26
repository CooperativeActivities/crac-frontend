import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TaskDataService } from '../../services/task_service';

@IonicPage({
  name: "task-detail",
})
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
  providers: [ TaskDataService ],
})
export class TaskDetailPage {

  task : any;
  timeChoice = 'slot';
  taskId : number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService) {
    this.taskId = navParams.data.id;
    this.doRefresh();


  }

  edit (){
    this.navCtrl.push('task-edit', {id: this.taskId});
  }

  async doRefresh (refresher=null) {

    await Promise.all([
      this.taskDataService.getTaskById(this.taskId).then((res) => {
        this.task = res.object
        console.log(this.task);

        if(this.task.startTime != this.task.endTime ){
          this.timeChoice = 'slot';
        } else {
          this.timeChoice = 'point';
        }

      }, (error) => {
        console.warn("Task could not be retrieved", error)
      })
    ])
    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }

  openMapView (){
    // Open Leaflet Map View //
    this.navCtrl.push('map-view', { id: this.taskId, address: this.task.address, lat: this.task.lat, lng: this.task.lng});
    //$state.go('tabsController.openMapView', { id: $scope.taskId, address: $scope.task.address, lat: $scope.task.lat, lng: $scope.task.lng});
  }

}
/*
// @TODO: move this to some global config file
var SUBTASKS_LIMITED_TO_SHALLOW = false;

cracApp.controller('singleTaskCtrl', ['$scope','$rootScope','$route', '$window', '$stateParams','$routeParams','TaskDataService','$state','$ionicPopup', 'ionicToast', "ErrorDisplayService", "$ionicHistory",
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$rootScope, $route, $window, $stateParams,$routeParams,TaskDataService, $state, $ionicPopup, ionicToast, ErrorDisplayService, $ionicHistory) {

  //Flags to show/hide buttons
  $scope.editableFlag =false;
  $scope.addSubTaskFlag =false;

  $scope.showEnroll =false;
  $scope.showCancel =false;
  $scope.showFollow = false;
  $scope.showUnfollow = false;
  $scope.showPublish = false;

  $scope.working = false;

  $scope.team = [];
  $scope.neededCompetences = [];
  $scope.timeChoice = 'slot';

  $scope.newComment = {name:'', content: ''};
  $scope.user = $rootScope.globals.currentUser.user;
  $scope.userIsDone = false;
  $scope.allAreDone = false;

  $scope.loaded = {
    shifts: false
  };

  $scope.doRefresh = function(){
    TaskDataService.getTaskById($stateParams.id).then(function (res) {
      var task = res.object;
      if(task.taskType === "SHIFT"){
        console.error("shift task should not be accessed like that, redirecting to parent", task)
        $state.go('tabsController.task', { id:task.superTask.id }, { location: "replace", reload: true }).then(function(res){
          $ionicHistory.removeBackView()
        });
        return
      }
      console.log("task detail view", task);

      if(task.userRelationships) task.userRelationships.sort($scope.sortMemberListByRelationship);

      if(task.participationDetails){
        $scope.participationType = task.participationDetails[0].participationType;
        $scope.userIsDone = task.participationDetails[0].completed;
      } else {
        $scope.participationType = "NOT_PARTICIPATING";
        $scope.userIsDone = false;
      }
      $scope.neededCompetences = task.taskCompetences;
      $scope.task = task;
      $scope.task.materials = $scope.task.materials.map(function(material){
        material.subscribedQuantityOtherUsers =
          material.subscribedUsers
          .filter(function(subscription){ return subscription.user !== $scope.user.id })
          .reduce(function(acc, val){ return acc + val.quantity }, 0)
        material.myQuantity = material.subscribedQuantity - material.subscribedQuantityOtherUsers
        return material
      })
      if($scope.task.startTime != $scope.task.endTime ){
        $scope.timeChoice = 'slot';
      } else {
        $scope.timeChoice = 'point';
      }
      $scope.updateFlags();
      $scope.$broadcast('scroll.refreshComplete');
      //});
    },function(error){
      ErrorDisplayService.showError(error.message);
    })
  };

  $scope.doRefresh();

  $scope.areAllParticipantsDone = function() {
    for(var i=0; i<$scope.task.userRelationships.length; i++) {
      var u = $scope.task.userRelationships[i];
      if( u.participationType === "PARTICIPATING" && !u.completed ) {
        return false;
      }
    }

    return true;
  };

  $scope.sortMemberListByRelationship = function(a,b) {
    if(b.participationType === "LEADING") {
      return 1;
    }
    if(b.friend) {
      return 1;
    }
    return 0;
  };

  $scope.updateFlags = function(){
    var relation = $scope.participationType,
      task = $scope.task,
      userHasPermissions = task.permissions,
      taskIsWorkable = task.taskType === 'WORKABLE',
      taskHasShifts = task.childTasks.length > 0 && taskIsWorkable,
      taskIsSubtask = !!task.superTask;

    //initialize all flags to false
    $scope.editableFlag =false;
    $scope.addSubTaskFlag =false;
    $scope.showPublish = false;

    $scope.showEnroll =false;
    $scope.showCancel =false;
    $scope.showShiftsMaterialsEnroll =false;
    $scope.showFollow = false;
    $scope.showUnfollow = false;
    $scope.allAreDone = $scope.areAllParticipantsDone();

    switch(task.taskState){
      case "COMPLETED":
        break;
      case "STARTED":
        if(userHasPermissions){
          $scope.editableFlag = true;
        }
        if(relation === "LEADING"){
          // @TODO allow leaders to also participate/follow?
        } else {
          // @DISCUSS: cannot unfollow started task?
          $scope.showShiftsMaterialsEnroll = true;
          $scope.showEnroll = relation !== "PARTICIPATING" && !taskHasShifts;
          $scope.showFollow = relation !== "FOLLOWING" && relation !== "PARTICIPATING";
          $scope.showCancel = relation === "PARTICIPATING";
        }
        break;
      case "PUBLISHED":
        if(userHasPermissions){
          $scope.editableFlag = true;
          $scope.addSubTaskFlag = $scope.task.taskType === 'ORGANISATIONAL' && (!SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask);
          $scope.editableFlag = true;
        }
        if(relation === "LEADING"){
          // @TODO allow leaders to also participate/follow
        } else {
          $scope.showShiftsMaterialsEnroll = true;
          $scope.showEnroll = relation !== "PARTICIPATING" && !taskHasShifts;
          $scope.showFollow = relation !== "FOLLOWING" && relation !== "PARTICIPATING";
          $scope.showCancel = relation === "PARTICIPATING";
          $scope.showUnfollow = relation === "FOLLOWING";
        }
        break;
      case "NOT_PUBLISHED":
        if(userHasPermissions){
          $scope.editableFlag = true;
          $scope.showPublish = true;
          $scope.addSubTaskFlag = $scope.task.taskType === 'ORGANISATIONAL' && (!SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask);
        }
        break;
    }
  };

  //To open another Task, e.g. SubTask
  $scope.loadSingleTask = function(taskId){
    $state.go('tabsController.task', { id:taskId });
  };

  // Get info for all shifts
  $scope.loadShifts = function() {
    if($scope.loaded.shifts) return;
    for(var i=0; i<$scope.task.childTasks.length; i++) {
      console.log("get shift " + $scope.task.childTasks[i].id);
      TaskDataService.getTaskById($scope.task.childTasks[i].id).then(function (res) {
        console.log(res);
        var shift = _.findIndex($scope.task.childTasks, {id: res.object.id});
        $scope.task.childTasks[shift] = res.object;
      }, function(error) {
        ionicToast.show("Schichtinformation konnte nicht geladen werden: " + error.message, 'top', false, 5000);
      });
    }
    $scope.loaded.shifts = true;
  }

  // Deleting all participating types
  $scope.cancel = function() {
    //failsafe, so you dont accidentally cancel leading a task
    if($scope.participationType !== "LEADING"){
      TaskDataService.removeOpenTask($scope.task.id).then(function (res) {
        console.log("unfollowed/cancelled");
        $scope.participationType = "NOT_PARTICIPATING";
        $scope.updateFlags();
      }, function (error) {
        ionicToast.show("Aufgabe kann nicht abgesagt werden: " + error.message, 'top', false, 5000);
      });
    }
  };

  //enable editing-mode
  $scope.edit = function(){
    $state.go('tabsController.taskEdit', {id: $scope.task.id}, {reload: true});
  };

  //Enroll for a task
  $scope.enroll = function(){
    if( $scope.task.taskType === 'WORKABLE' && $scope.task.childTasks.length > 0 ) {
      //if a task has shifts, general enrolment is forbidden, this shouldn't happen
      return;
    }

    TaskDataService.changeTaskPartState($stateParams.id ,'participate').then(function(res) {
      $scope.participationType = "PARTICIPATING";
      $scope.updateFlags();
    }, function(error) {
      ionicToast.show("An der Aufgabe kann nicht teilgenommen werden: " + error.message, 'top', false, 5000);
    });
  };

  //add self to a shift
  $scope.addToShift = function(shift) {

    console.log('shift to paticipate', shift);

    TaskDataService.changeTaskPartState(shift.id ,'participate').then(function(res) {
      //@TODO update task object
      console.log('Participating in shift ' + shift.id);
      $scope.assigned = true;
      shift.signedUser++;
      $scope.signedUsers++;
    }, function(error) {
      ionicToast.show("An der Schicht kann nicht teilgenommen werden: " + error.message, 'top', false, 5000);
    });


  };

  //remove self from shift
  $scope.removeFromShift = function(shift) {
    TaskDataService.removeOpenTask(shift.id).then(function (res) {
      console.log('Not participating in shift ' + shift.id);
      $scope.assigned = false;
      shift.signedUsers--;
      $scope.signedUsers--;
    }, function(error) {
      ionicToast.show("An der Schicht kann nicht zurückgezogen werden: " + error.message, 'top', false, 5000);
    });

  };

  // follow a task
  $scope.follow = function(){
    TaskDataService.changeTaskPartState($scope.task.id,'follow').then(function(res) {
      $scope.participationType = "FOLLOWING";
      $scope.updateFlags();
    }, function(error) {
      ionicToast.show("Aufgabe kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
    });
  };

  $scope.makeNewSubTask = function(){
    $state.go('tabsController.newTask', { parentId: $scope.task.id });
  };

  //Complete a task
  $scope.complete = function() {
    $scope.completeTask('complete');
  };
  $scope.forceComplete = function() {
    $scope.completeTask('forceComplete');
  };
  $scope.completeTask = function(state) {
    if(!$scope.task.permissions) return false;

    TaskDataService.changeTaskState($scope.task.id, state).then(function (res) {
      console.log("Task is completed");
      $scope.task.taskState = 'COMPLETED';
      $scope.updateFlags();
      console.log(res);
    }, function (error) {
      if( error.data.errors[0].name === 'NOT_COMPLETED_BY_USERS' ) {
        $ionicPopup.confirm({
          title: "Task kann nicht als fertig markiert werden:",
          template: "Noch nicht alle Teilnehmer haben die Task als fertig markiert. Task trotzdem abschließen?",
          okText: "Abschließen",
          cancelText: "Abbrechen"
        }).then(function (res) {
          if (res) $scope.forceComplete();
        });
      } else {
        ionicToast.show("Aufgabe kann nicht abgeschlossen werden: " + error.message, 'top', false, 5000);
      }
    });
  };

  //Set a task as done
  $scope.done = function(){
    if(!$scope.task.permissions) return false;

    TaskDataService.setTaskDone($scope.task.id,"true").then(function (res) {
      console.log("Task is done");
      $scope.userIsDone = true;
      $scope.allAreDone = $scope.areAllParticipantsDone();
    }, function (error) {
      ionicToast.show("Aufgabe kann nicht als fertig markiert werden: " + error.message, 'top', false, 5000);
    });
  };

  //unset task as done
  $scope.notDone = function() {
    if(!$scope.task.permissions) return false;

    TaskDataService.setTaskDone($scope.task.id,"false").then(function (res) {
      $scope.userIsDone = false;
      $scope.allAreDone = false;
    }, function (error) {
      ionicToast.show("Aufgabe kann nicht gelost werden: " + error.message, 'top', false, 5000);
    });
  };

  //Publish a task
  $scope.publish = function() {
    console.log('publish');
    if($scope.task.taskType === 'ORGANISATIONAL'){
      if($scope.task.childTasks.length <= 0){
        var message = "Übersicht hat noch keine Unteraufgabe! Bitte füge eine Unteraufgabe hinzu!";
        ionicToast.show("Task kann nicht veröffentlicht werden: " + message, 'top', false, 5000);
        return;
      }
    }

    if( !$scope.task.readyToPublish ) {
      // @TODO - display popup with reason(s) why it's not ready
      /*
      var message = "";
      ionicToast.show("Task kann nicht veröffentlicht werden: " + message, 'top', false, 5000)*/
/*
      return;
    }

    var taskId = $scope.task.id;
    TaskDataService.changeTaskState(taskId, 'publish').then(function(res) {
      ionicToast.show("Task veröffentlicht", 'top', false, 5000);
      $scope.showPublish = false;
    }, function(error) {
      ionicToast.show("Aufgabe kann nicht veröffentlicht werden: " + error.message, 'top', false, 5000);
    });
  };

  //Add a new comment to the task
  $scope.addNewComment = function() {
    //don't add comment if it is empty
    if(!$scope.newComment.content) return false;
    //set the commenter as current user
    $scope.newComment.name = $scope.user.name;

    TaskDataService.addComment($scope.task.id, $scope.newComment).then(function (res) {
      console.log("comment added");
      $scope.newComment = {name:'', content: ''};
      //@TODO we should not need to refresh the whole task to add/remove comments
      $scope.doRefresh();
    }, function (error) {
      ionicToast.show("Kommentar kann nicht hinzufügen werden: " + error.message, 'top', false, 5000);
    });
  };

  //Delete a comment from the task
  $scope.removeComment = function(comment) {
    //@TODO - DISCUSS should task leader/admin be able to delete any comment?
    //user should not be able to delete a comment someone else
    if($scope.user !== comment.name) return false;

    TaskDataService.removeComment($scope.task.id,comment.id).then(function (res) {
      console.log("comment removed");
      //@TODO we should not need to refresh the whole task to add/remove comments
      $scope.doRefresh();
    }, function (error) {
      ionicToast.show("Kommentar kann nicht gelöscht werden: " + error.message, 'top', false, 5000);
    });
  };

  //Check if user is the owner of the comment
  $scope.checkCommentOwner = function(name){
    return name === $scope.user;
  };

  //Check if task has a location
  $scope.checkLocation = function(location){
    return location != null;
  };

  $scope.getCompetenceColors = function(competence){
    var competenceUserRel = _.find($rootScope.globals.userInfoCompetences, function(rel){
      return rel.competence.id === competence.id
    });
    if(competenceUserRel){
      // likeValue = competenceUserRel.likeValue
      // proficiencyValue = competenceUserRel.proficiencyValue
    } else {
    }
    var hueLowImportance = 120 // green
      , hueHighImportance = 0; // blue
    var saturationLowProficiency = 90 // brighter
      , saturationHighProficiency = 65; // darker
    var hue = hueLowImportance + (competence.importanceLevel / 100 * (hueHighImportance - hueLowImportance));
    var saturation = saturationLowProficiency + (competence.neededProficiencyLevel / 100 * (saturationHighProficiency - saturationLowProficiency));
    return { "background-color":"hsl("+ Math.floor(hue) +",100%,"+ Math.floor(saturation) +"%)" }
  };

  $scope.subscribe = function(material){
    //save material subscription for any quantity. If zero, call unsubscribe, otherwise continue.
    if( material.myQuantity === 0 ) {
      if(material.subscribedQuantityOtherUsers === material.subscribedQuantity) {
        return false;
      }
      $scope.unsubscribe(material);
      return;
    }
    if(material.subscribedQuantityOtherUsers === material.quantity) {
      ionicToast.show("Maximum überschritten", 'top', false, 5000);
      return;
    }
    if( material.myQuantity === undefined ) {
      ionicToast.show("Menge ungültig. Menge muss zwischen 0 und " + (material.quantity - material.subscribedQuantity) + " sein.", 'top', false, 5000);
      return;
    }
    if($scope.materialSubscribeError(material)){
      ionicToast.show("Maximum überschritten: " + error.message, 'top', false, 5000);
      return;
    }

    TaskDataService.subscribeToMaterial($scope.task.id, material.id, material.myQuantity).then(function(res){
      console.log("Material subscribed");
    }, function(error){
      ionicToast.show("Materialien können nicht gespeichert werden: " + error.message, 'top', false, 5000);
    });

  };
  $scope.materialSubscribeError = function(material){
    return material.myQuantity < 0 || material.myQuantity > (material.quantity - material.subscribedQuantityOtherUsers)
  }

  $scope.unsubscribe = function(material){
    TaskDataService.unsubscribeFromMaterial($scope.task.id, material.id).then(function(res){
      console.log("Material unsubscribed");
    }, function(error){
      ionicToast.show("Materialien können nicht gespeichert werden: " + error.message, 'top', false, 5000);
    });
  };

  $scope.openMapView = function(){
    // Open Leaflet Map View //
    $state.go('tabsController.openMapView', { id: $scope.taskId, address: $scope.task.address, lat: $scope.task.lat, lng: $scope.task.lng});
  }
}]);
*/
