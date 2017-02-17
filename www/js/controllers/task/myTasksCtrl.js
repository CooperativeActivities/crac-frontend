/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('myTasksCtrl', ['$scope','$window','$route', '$stateParams','$routeParams','TaskDataService','$state',
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope,$window, $route, $stateParams, $routeParams, TaskDataService, $state) {

  $scope.completed ="'!' + 'COMPLETED'";
  $scope.doRefresh = function(){
    TaskDataService.getMyTasks().then(function(res) {
			console.log("My Tasks: ");
			console.log(res);
      $scope.participatingTasks = res.data.participating
      $scope.followingTasks = res.data.following
      $scope.leadingTasks = res.data.leading
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error) {
      console.log('An error occurred!', error);
    })
  }

  $scope.doRefresh();

  $scope.makeNewTask= function(){
    $state.go('tabsController.newTask');
  }

  $scope.loadSingleTask = function(taskId){
    $state.go('tabsController.task', { id:taskId }, {reload:true});
  }
  $scope.cancle = function(id){
    TaskDataService.removeOpenTask(id).then(function(res) {
      console.log("deleted");
      $state.reload();
      $window.location.reload();
    }, function(error) {
      console.log('An error occurred!', error);
    });
  }

  $scope.notCompleted = function(item)
  {
    return (item.type !== 'foo');
  };



}])
