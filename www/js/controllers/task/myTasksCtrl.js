/**
 * Created by P41332 on 25.10.2016.
 */
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
