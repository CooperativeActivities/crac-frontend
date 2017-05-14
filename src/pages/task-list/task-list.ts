import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: "task-list",
})
@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html',
})
export class TaskListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskListPage');
  }

}
/*

cracApp.controller('tasklistCtrl', function ($rootScope, $state, $scope, $http, $ionicModal, TaskDataService, $q) {

  $scope.loadSingleTask = function(task){
    if(task.taskType === "SHIFT"){
      $state.go('tabsController.task', { id:task.superTask }, {reload:true});
    } else {
      $state.go('tabsController.task', { id:task.id }, {reload:true});
    }
  };

  $scope.doRefresh = function(){
    $q.all(
      TaskDataService.getMatchingTasks(3).then(function(res){
          $scope.matchingTasks = res.object;
          console.log("Matching tasks: ");
          console.log(res.object);
        }, function(error){
          console.warn("Matching tasks could not be retrieved", error);
        }),
        TaskDataService.getAllParentTasks().then(function (res) {
          $scope.parentTasks = res.object;
          console.log("Matching tasks: ");
          console.log(res.object);
        }, function (error) {
          console.warn("All task list could not be retrieved", error);
        })
      ).then(function(res){
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  $scope.doRefresh();

  /*----------------------------------------------------------------------------------------------------------------- */
/*
  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
 */

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
/*
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
});

 */
