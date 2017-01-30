/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('myTasksCtrl', ['$scope','$window','$route', '$stateParams','$routeParams','TaskDataService','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$window, $route, $stateParams, $routeParams, TaskDataService, $state) {

  $scope.completed ="'!' + 'COMPLETED'";
  $scope.doRefresh = function(){
    TaskDataService.getMyTasks().then(function(res) {
      $scope.participatingTasks = res.data.participating
      $scope.followingTasks = res.data.following
      $scope.leadingTasks = res.data.leading
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error) {
      console.log('An error occurred!', error);
    })
  }

  $scope.doRefresh();

  $scope.loadSingleTask = function(taskId){
    console.log("In fkt")
    $state.go('tabsController.task1', { id:taskId });
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
