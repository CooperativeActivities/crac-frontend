/**
 * Created by P41332 on 25.10.2016.
 */

/*
 cracApp.controller('allTasksCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
 // You can include any angular dependencies as parameters for this function
 // TIP: Access Route Parameters for your page via $stateParams.parameterName
 function ($scope, $stateParams) {


 }])
 */

cracApp.controller('allTasksCtrl', function ($rootScope, $state, $scope, $http, $ionicModal, TaskDataService) {
  console.log("Taskdata: " + $rootScope.globals.currentUser)


  $scope.loadSingleTask = function(taskId){
    console.log("In fkt")
    $state.go('tabsController.task1', { id:taskId });
  }

  TaskDataService.getAllParentTasks().then(function (res) {
    $scope.tasks = res.data;
    console.log("scope.task = " + $scope.tasks);
    angular.forEach($scope.tasks, function(item){
      console.log("taskname " + item.name + item.description);
    })
  }, function (error) {
    console.log('An error occurred!', error);
  });

  $scope.getTaskById= function(id){
    TaskDataService.getTaskById(id).then(function (res) {
      $scope.tasks = res.data;
      console.log("scope.task = " + $scope.tasks);
      $scope.singleTask = res;
    }, function (error) {
      console.log('An error occurred!', error);
    });
  }
})
