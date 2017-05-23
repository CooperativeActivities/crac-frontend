import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';

@IonicPage({
  name: "my-tasks",
})
@Component({
  selector: 'page-my-tasks',
  templateUrl: 'my-tasks.html',
  providers: [ TaskDataService ],
})
export class MyTasksPage {

  participatingTasks : Array<any>;
  followingTasks : Array<any>;
  leadingTasks: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService) {
  }


  ngOnInit(){
    this.doRefresh()
  }

  async doRefresh (refresher=null) {
    await Promise.all([
      this.taskDataService.getMyTasks().then((res) => {
        console.log(res);
        this.participatingTasks = res.meta.participating;
        this.followingTasks = res.meta.following;
        this.leadingTasks = res.meta.leading;
      }, (error) => {
        console.warn("Matching tasks could not be retrieved", error)
      })
    ])
    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTasksPage');
  }

  loadSingleTask(task){
    if(task.taskType === "SHIFT"){
      this.navCtrl.push('task-detail', { id: task.superTask })
    } else {
      this.navCtrl.push('task-detail', { id: task.id })
    };
  }

}
  /*
cracApp.controller('myTasksCtrl', ['$scope','$window','$route', '$stateParams','$routeParams','TaskDataService','ionicToast','$state',
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope,$window, $route, $stateParams, $routeParams, TaskDataService, ionicToast, $state) {

  $scope.completed ="'!' + 'COMPLETED'";
  $scope.doRefresh = function(){
    TaskDataService.getMyTasks().then(function(res) {
      console.log("My Tasks: ");
		  console.log(res);
      $scope.participatingTasks = res.meta.participating;
      $scope.followingTasks = res.meta.following;
      $scope.leadingTasks = res.meta.leading;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error) {
      ionicToast.show("Aufgabe kann nicht geladen werden: " + error.message, 'top', false, 5000)
    })
  };

  $scope.doRefresh();

  $scope.makeNewTask= function(){
    $state.go('tabsController.newTask');
  };

  $scope.loadSingleTask = function(task){
    if(task.taskType === "SHIFT"){
      $state.go('tabsController.task', { id:task.superTask }, {reload:true});
    } else {
      $state.go('tabsController.task', { id:task.id }, {reload:true});
    }
  }
}]);
   */
