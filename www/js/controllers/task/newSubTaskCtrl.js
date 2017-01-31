/**
 * Created by x-net on 15.12.2016.
 */
cracApp.controller('newSubTaskCtrl', ['$scope','$route', '$stateParams','$routeParams','TaskDataService','$state', "$ionicHistory",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,$routeParams,TaskDataService,$state, $ionicHistory) {
    $scope.task = {};
    $scope.parentTask = {};

    TaskDataService.getTaskById($stateParams.id).then(function(res){
      $scope.parentTask =res.data;
    },function(error){
      console.log('An error occurred!', error);
    });

    $scope.save = function(){
      var taskData = {};
      taskData.name= $scope.task.name;
      taskData.description= $scope.task.description;
      taskData.location= $scope.task.location;
      taskData.startTime= $scope.task.startTime;
      taskData.endTime= $scope.task.endTime;
      taskData.urgency= $scope.task.urgency;
      taskData.amountOfVolunteers= $scope.task.amountOfVolunteers;

        TaskDataService.createNewSubTask(taskData, $stateParams.id).then(function (res) {
          $ionicHistory.goBack();
        }, function (error) {
          console.log('An error occurred!', error);
          alert(error.data.cause);
        });

    };

  }])
