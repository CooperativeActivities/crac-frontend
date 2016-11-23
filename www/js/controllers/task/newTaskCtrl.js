/**
 * Created by x-net on 07.11.2016.
 */
cracApp.controller('newTaskCtrl', ['$scope','$route', '$stateParams','$routeParams','TaskDataService','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,$routeParams,TaskDataService,$state) {

    $scope.task= {};

    $scope.save = function(){
      var taskData = {};
      taskData.name= $scope.task.name;
      taskData.description= $scope.task.description;
      taskData.urgency= $scope.task.urgency;
      taskData.amountOfVolunteers= $scope.task.amountOfVolunteers;
      taskData.location= $scope.task.location;
      taskData.startTime= $scope.task.startTime;
      taskData.endTime= $scope.task.endTime;

      console.log($scope.task);

      TaskDataService.createNewTask(taskData).then(function(res) {
        console.log(taskData);
        console.log(res.data);
        $route.reload();
        $state.go('tabsController.tasklist');
      }, function(error) {
        console.log('An error occurred!', error);
      });
    };

  }])
