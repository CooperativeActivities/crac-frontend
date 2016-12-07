/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('singleTaskCtrl', ['$scope','$route', '$window', '$stateParams','$routeParams','TaskDataService','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope,$route, $window, $stateParams,$routeParams,TaskDataService,$state) {

    $scope.editFlag =true;
    $scope.enrollFlag =false;
    $scope.followFlag = false;



    $scope.getTaskById= function(id){
      TaskDataService.getTaskById(id).then(function (res) {
        $scope.task = res.data;
        console.log($scope.task);
      }, function (error) {
        console.log('An error occurred!', error);
      });
    }

    $scope.loadSingleTask = function(taskId){
      console.log("In fkt")
      $state.go('tabsController.task1', { id:taskId });
    }

    $scope.getTaskById($stateParams.id);

    TaskDataService.getTaskRelatById($stateParams.id).then(function (res) {
      $scope.participationType = res.data[1].participationType;
      console.log(res.data);
      console.log($scope.participationType);
      if($scope.participationType == "PARTICIPATING"){
        $scope.enrollFlag =true;
      }
      if($scope.participationType == "FOLLOWING"){
        $scope.followFlag =true;
      }
    }, function (error) {
      console.log('An error occurred!', error);
    });

    $scope.cancle = function() {
      TaskDataService.removeOpenTask($scope.task.id).then(function (res) {
        console.log("deleted");
        $scope.enrollFlag = false;
        $scope.followFlag = false;
        $state.reload();
        //$window.location.reload();
      }, function (error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    }

    $scope.save = function(){
      var taskData = {};
      taskData.description= $scope.task.description;
      taskData.urgency= $scope.task.urgency;
      taskData.amountOfVolunteers= $scope.task.amountOfVolunteers;
      taskData.feedback= $scope.task.feedback;
      taskData.taskState= $scope.task.taskState;
      taskData.taskType= $scope.task.taskType;
      taskData.taskRepetitionState= $scope.task.taskRepetitionState;
      taskData.superTask= $scope.task.superTask;
      taskData.childTask= $scope.task.childTask;
      taskData.previousTask= $scope.task.previousTask;
      taskData.nextTask= $scope.task.nextTask;


      TaskDataService.updateTaskById(taskData, $scope.task.id).then(function(res) {
        console.log(taskData);
        console.log(res.data);
        $scope.editFlag =true;
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    };
    $scope.edit = function(){
      $scope.editFlag =false;
    };

    $scope.enroll = function(){
      TaskDataService.changeTaskPartState($stateParams.id ,'participate').then(function(res) {
        console.log(res.data);
        $scope.enrollFlag = true;
        $scope.followFlag = false;
        $state.reload();
       // $window.location.reload();
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    }

    $scope.follow = function(){
      TaskDataService.changeTaskPartState($scope.task.id,'follow').then(function(res) {
        console.log(res.data);
        $scope.followFlag = true;
        $scope.enrollFlag = false;
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    };

    $scope.delete = function(){
        TaskDataService.deleteTaskById($scope.task.id);
    }

    $scope.readyToPublish = function(){
      TaskDataService.setReadyToPublishS($scope.task.id).then(function(res) {
        console.log('works');
        console.log(res.data);
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });

    }
    $scope.publish = function(){
      TaskDataService.changeTaskState($scope.task.id, 'publish').then(function(res) {
        TaskDataService.getTaskById(id).then(function (res) {
          $scope.task = res.data;
          console.log($scope.task);
        }, function (error) {
          console.log('An error occurred!', error);
        });
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
      console.log('works 2');
    }

  }])
