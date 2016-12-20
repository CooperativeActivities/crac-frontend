/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('singleTaskCtrl', ['$scope','$route', '$window', '$stateParams','$routeParams','TaskDataService','$state','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope,$route, $window, $stateParams,$routeParams,TaskDataService,$state, $ionicPopup) {

    //Flags to show/hide buttons
    $scope.editFlag =true;
    $scope.enrollFlag =false;
    $scope.ufollowFlag = false;
    $scope.followFlag = true;
    $scope.readyToPublishTreeFlag = true;
    $scope.readyToPublishSingleFlag = true;
    $scope.publishFlag = true;
    $scope.addSubTaskFlag =true;
    $scope.deleteFlag =true;

    //Get specific Task by ID
    $scope.getTaskById= function(id){
      TaskDataService.getTaskById(id).then(function (res) {
        $scope.task = res.data;
        console.log($scope.task);
        if($scope.task.childTasks == ''){
          $scope.readyToPublishTreeFlag = false;
        }
        if($scope.task.superTask != null){
          $scope.publishFlag = false;
        }
        if($scope.task.taskState == "STARTED"){
          $scope.addSubTaskFlag =false;
          $scope.ufollowFlag = false;
          $scope.followFlag = false;
          $scope.deleteFlag =false;
          $scope.publishFlag = false;
          $scope.readyToPublishSingleFlag = false;
        }
        if($scope.task.taskState == "PUBLISHED"){
          $scope.addSubTaskFlag =false;
          $scope.publishFlag = false;
          $scope.readyToPublishSingleFlag = false;
        }
        if($scope.task.childTasks != ''){
          $scope.addSubTaskFlag =true;
        }
      }, function (error) {
        console.log('An error occurred!', error);
      });
    }
//To open another Task, e.g. SubTask
    $scope.loadSingleTask = function(taskId){
      console.log("In fkt")
      $state.go('tabsController.task1', { id:taskId });
    }

    $scope.getTaskById($stateParams.id);
// Get the Relationship of a specific Task and the current user
    TaskDataService.getTaskRelatById($stateParams.id).then(function (res) {
      $scope.participationType = res.data[1].participationType;
      console.log(res.data);
      console.log($scope.participationType);
      if($scope.participationType == "PARTICIPATING"){
        $scope.enrollFlag =true;
        $scope.followFlag =false;
        $scope.ufollowFlag =false;
      }
      if($scope.participationType == "FOLLOWING"){
        $scope.followFlag =false;
        $scope.ufollowFlag =true;
      }
    }, function (error) {
      console.log('An error occurred!', error);
    });
// Deleting all participating types
    $scope.cancle = function() {
      TaskDataService.removeOpenTask($scope.task.id).then(function (res) {
        console.log("deleted");
        $scope.enrollFlag = false;
        $scope.followFlag = true;
        $scope.ufollowFlag = false;
        $state.reload();
        //$window.location.reload();
      }, function (error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    }
// Save changes
    $scope.save = function(){
      var taskData = {};
      taskData.name= $scope.task.name;
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
      taskData.startTime= $scope.task.startTime;
      taskData.endTime= $scope.task.endTime;

      TaskDataService.updateTaskById(taskData, $scope.task.id).then(function(res) {
        console.log(taskData);
        console.log(res.data);
        $scope.editFlag =true;
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    };
    //enable editing-mode
    $scope.edit = function(){
      $scope.editFlag =false;
    };
    //Enroll for a task
    $scope.enroll = function(){
      TaskDataService.changeTaskPartState($stateParams.id ,'participate').then(function(res) {
        console.log(res.data);
        $scope.enrollFlag = true;
        $scope.followFlag = false;
        $scope.ufollowFlag = false;
        $state.reload();
       // $window.location.reload();
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    }
// follow a task
    $scope.follow = function(){
      TaskDataService.changeTaskPartState($scope.task.id,'follow').then(function(res) {
        console.log(res.data);
        $scope.followFlag = false;
        $scope.ufollowFlag = true;
        $scope.enrollFlag = false;
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    };
// delete a task
    $scope.delete = function(){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Löschen',
        template: 'Wollen sie diese Aufgabe wirklich löschen? Es wird die Aufgabe mit ALLEN darunterliegenden Aufgaben permanent gelöscht.'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          TaskDataService.deleteTaskById($scope.task.id).then(function(res) {
            console.log(res.data);
            $state.go('tabsController.tasklist');
          }, function(error) {
            console.log('An error occurred!', error);
            alert(error.data.cause);
          });
        } else {
          console.log('You are not sure');
        }
      });
    }

//Set the task and all task under this one to ready to publish (only possible if every input field is filled out correctly)
    $scope.readyToPublishT = function() {
      TaskDataService.setReadyToPublishT($scope.task.id).then(function (res) {
        console.log('worksT');
        console.log(res.data);
      }, function (error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    }
//Set only this task to ready to publish (only possible if every input field is filled out correctly)
      $scope.readyToPublishS = function(){
        TaskDataService.setReadyToPublishS($scope.task.id).then(function(res) {
          console.log('worksS');
          console.log(res.data);
        }, function(error) {
          console.log('An error occurred!', error);
          alert(error.data.cause);
        });
    }
//publish task
    $scope.publish = function(){
      TaskDataService.changeTaskState($scope.task.id, 'publish').then(function(res) {
        TaskDataService.getTaskById($scope.task.id).then(function (res) {
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

    $scope.makeNewSubTask = function(){
      $state.go('tabsController.newSubTask', { id:$scope.task.id });
    }
//Complete a task
    $scope.complete = function(){
      TaskDataService.changeTaskState($scope.task.id, 'complete').then(function(res) {
        TaskDataService.getTaskById($scope.task.id).then(function (res) {
          $scope.task = res.data;
          console.log($scope.task);
          $state.go('tabsController.tasklist');
        }, function (error) {
          console.log('An error occurred!', error);
        });
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
//Set a task as done
      $scope.done = function(){
        TaskDataService.setTaskDone($scope.task.id,"true").then(function () {
          console.log("works");
        }, function (error) {
          console.log('An error occurred!', error);
        });
      }

    }




  }])
