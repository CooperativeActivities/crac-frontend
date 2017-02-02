/**
 * Created by x-net on 07.11.2016.
 */
cracApp.controller('newTaskCtrl', ['$scope','$route', '$stateParams','$routeParams','TaskDataService','$state', "$ionicHistory",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,$routeParams,TaskDataService,$state, $ionicHistory) {

    $scope.task= {};
    $scope.parentTask = null;

    $scope.load = function(){
      if($stateParams.parentId !== ""){
        TaskDataService.getTaskById($stateParams.parentId).then(function(res){
          $scope.parentTask = res.data;
        },function(error){
          console.log('An error occurred!', error);
        });
      }
    }

    $scope.save = function(){
      var taskData = {};
      taskData.name= $scope.task.name;
      taskData.description= $scope.task.description;
      taskData.location= $scope.task.location;
      taskData.startTime= $scope.task.startTime;
      taskData.endTime= $scope.task.endTime;
      taskData.amountOfVolunteers= $scope.task.amountOfVolunteers;


      if($scope.parentTask === null){
        TaskDataService.createNewTask(taskData).then(function(res) {
          $ionicHistory.goBack();
          //$scope.loadSingleTask(res.data.task)
        }, function(error) {
          console.log('An error occurred!', error);
          alert("Es muss jedes Feld ausgefüllt sein:"+ error.data.cause);
        });
      } else {
        TaskDataService.createNewSubTask(taskData, $scope.parentTask.id).then(function (res) {
          $ionicHistory.goBack();
          //$scope.loadSingleTask(res.data.task)
        }, function (error) {
          console.log('An error occurred!', error);
          alert(error.data.cause);
        });
      }
    };

    $scope.loadSingleTask = function(taskId){
      var x =$state.go('tabsController.task1', { id:taskId }, { location: "replace" }).then(function(res){
        debugger
        $ionicHistory.removeBackView()
      });
    }

    $scope.load()

  }])
