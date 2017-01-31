
/**
 * Created by md@x-net on 2017-01-31
 */
cracApp.controller('taskEditCtrl', ['$scope','$route', '$stateParams','$routeParams','TaskDataService','$state', "$ionicHistory", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,$routeParams,TaskDataService,$state, $ionicHistory) {

    $scope.task= {};
    $scope.publishFlag = false;
    $scope.readyToPublishFlag = false;

// Save changes
    $scope.save = function(){
      var taskData = {};
      taskData.name= $scope.task.name;
      taskData.description= $scope.task.description;
      taskData.urgency= $scope.task.urgency;
      taskData.amountOfVolunteers= $scope.task.amountOfVolunteers;
      taskData.location= $scope.task.location;
      taskData.feedback= $scope.task.feedback;
      taskData.taskState= $scope.task.taskState;
      taskData.taskType= $scope.task.taskType;
      taskData.taskRepetitionState= $scope.task.taskRepetitionState;
      // if we set this, we get a 400
      //taskData.superTask= $scope.task.superTask;
      taskData.childTask= $scope.task.childTask;
      taskData.previousTask= $scope.task.previousTask;
      taskData.nextTask= $scope.task.nextTask;

      taskData.startTime= $scope.task.startTime.getTime();
      taskData.endTime= $scope.task.endTime.getTime();

      TaskDataService.updateTaskById(taskData, $scope.task.id).then(function(res) {
        $route.reload();
        $ionicHistory.goBack();
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    };

    $scope.getTaskById= function(id){
      TaskDataService.getTaskById(id).then(function (res) {
        $scope.task = res.data;
        $scope.task.startTime = new Date($scope.task.startTime)
        $scope.task.endTime = new Date($scope.task.endTime)
        $scope.publishFlag = $scope.task.taskState === "NOT_PUBLISHED";
        $scope.readyToPublishFlag = $scope.task.taskState !== "PUBLISHED";
      }, function (error) {
        console.log('An error occurred!', error);
      });
    }
//publish task
    $scope.publish = function(){
      TaskDataService.changeTaskState($scope.task.id, 'publish').then(function(res) {
        $scope.getTaskById($scope.task.id);
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    }
    $scope.readyToPublish = function(){
      TaskDataService.setReadyToPublishS($scope.task.id).then(function(res){
        console.log(res);
      }, function(error){
        console.log('An error occurred!', error);
      })
    }
    $scope.readyToPublishTree = function(){
      TaskDataService.setReadyToPublishT($scope.task.id).then(function(res){
        console.log(res);
      }, function(error){
        console.log('An error occurred!', error);
      })
    }

    $scope.getTaskById($stateParams.id);

  }])
