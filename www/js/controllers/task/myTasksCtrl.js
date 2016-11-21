/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('myTasksCtrl', ['$scope','$window','$route', '$stateParams','$routeParams','TaskDataService','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$window, $route, $stateParams, $routeParams, TaskDataService, $state) {
  $state.reload();
  TaskDataService.getMyTasks().then(function(res) {
    $scope.tasks=res.data;
    console.log($scope.tasks);
  }, function(error) {
    console.log('An error occurred!', error);
  });

  $scope.loadSingleTask = function(taskId){
    console.log("In fkt")
    $state.go('tabsController.task1', { id:taskId });
  }
  $scope.cancle = function(id){
    TaskDataService.removeOpenTask(id).then(function(res) {
      console.log("deleted");
      $state.reload();
    }, function(error) {
      console.log('An error occurred!', error);
    });
  }



}])
