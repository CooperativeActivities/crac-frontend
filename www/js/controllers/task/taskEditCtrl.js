
/**
 * Created by md@x-net on 2017-01-31
 */
cracApp.controller('taskEditCtrl', ['$scope','$route', '$stateParams','TaskDataService','UserDataService', "$ionicHistory", "$q", "$ionicPopup",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,TaskDataService, UserDataService, $ionicHistory, $q, $ionicPopup) {
    $scope.task= {};
    $scope.showPublish = false;
    $scope.showReadyToPublishSingle = false;
    $scope.showReadyToPublishTree = false;
    //this needs to be an object for the select to work (angular is weird)
    $scope.select = { competenceToAdd : null };

    $scope.load = function(){
      // @TODO: check if task.userIsLeading, if not, go back
      TaskDataService.getTaskById($stateParams.id).then(function (res) {
        var task = res.data;
        console.log("edit", task)
        if(!task) return;
        TaskDataService.getAllAvailableCompetences(task.id).then(function(res){ return res.data })
        .then(function(availableCompetences){
          $scope.neededCompetences = task.taskCompetences;
          $scope.availableCompetences = availableCompetences;
          $scope.task = task;
          $scope.task.startTime = new Date($scope.task.startTime)
          $scope.task.endTime = new Date($scope.task.endTime)
          $scope.updateFlags()
        })
      }, function (error) {
        console.log('An error occurred!', error);
      });
    };

    $scope.updateFlags = function(){
      var task = $scope.task;

      //initialize all flags to false
      $scope.showPublish =false;
      $scope.showReadyToPublishSingle =false;
      $scope.showReadyToPublishTree = false;

      switch(task.taskState){
        case "COMPLETED":
          //disable all fields
          break;
        case "STARTED":
          //disable all fields
          break;
        case "PUBLISHED":
          break;
        case "NOT_PUBLISHED":
          $scope.showPublish = $scope.task.superTask === null;
          $scope.showReadyToPublishSingle = !$scope.task.readyToPublish;
          $scope.showReadyToPublishTree = !$scope.task.readyToPublish && $scope.task.childTasks.length > 0;
          break;
      }
    };

// Save changes
    $scope.save = function(){
      var taskData = {};
      taskData.name= $scope.task.name;
      taskData.description= $scope.task.description;
      taskData.minAmountOfVolunteers= $scope.task.minAmountOfVolunteers;
      taskData.location= $scope.task.location;

      // @TODO: remove: this currently needs to be set in order to publish tasks
      if($scope.task.superTask === null){
        taskData.maxAmountOfVolunteers = 1;
      }
      // @TODO: ensure that startTime/endTime are within startTime/endTime of superTask
      taskData.startTime= $scope.task.startTime.getTime();
      taskData.endTime= $scope.task.endTime.getTime();

      // @TODO: this shouldn't be necessary
      taskData.taskState = $scope.task.taskState;

      TaskDataService.updateTaskById(taskData, $scope.task.id).then(function(res) {
        $scope.load()
        // this can be closed automatically (setTimeout and .close()) in case it annoys ppl
        $ionicPopup.alert({
          title: "Task gespeichert",
          okType: "button-positive button-outline"
        })
        /* $route.reload();
        $ionicHistory.goBack(); */
      }, function(error) {
        console.log('An error occurred!', error);
        var message = "";
        switch(error.data.cause){
            // @TODO: welche fehler gibt es hier?
          default: message = "Anderer Fehler: " + error.data.cause;
        }
        $ionicPopup.alert({
          title: "Task kann nicht gespeichert werden",
          template: message,
          okType: "button-positive button-outline"
        })
      });
    };


    $scope.addCompetence = function(){
      if(!$scope.select.competenceToAdd) return;
      var competenceId = $scope.select.competenceToAdd;
      TaskDataService.addCompetenceToTask($scope.task.id, competenceId,
        // @TODO: make the configurable
        100, 100, false).then(function(res){
          var index;
          $scope.availableCompetences.forEach(function(val, ind, arr){ if(val.id === competenceId) index = ind; });
          var competence = $scope.availableCompetences.splice(index, 1)[0]
          $scope.neededCompetences.push(competence)
        }, function(error){
          console.log('An error occurred adding a competence!', error);
        });
    };
//publish task
    $scope.publish = function(){
      TaskDataService.changeTaskState($scope.task.id, 'publish').then(function(res) {
        $scope.load()
        //$ionicHistory.goBack();
      }, function(error) {
        console.log('An error occurred!', error);
        var message = "";
        switch(error.data.cause){
          case "MISSING_COMPETENCES": message = "Bitte füge Kompetenzen hinzu."; break;
          case "CHILDREN_NOT_READY":  message = "Unteraufgaben sind noch nicht bereit."; break;
          default: message = "Anderer Fehler: " + error.data.cause;
        }
        $ionicPopup.alert({
          title: "Task kann nicht veröffentlicht werden",
          template: message,
          okType: "button-positive button-outline"
        })
      });
    }
    $scope.readyToPublish = function(){
      TaskDataService.setReadyToPublishS($scope.task.id).then(function(res){
        if(!res.data.success){
          var message = "";
          switch(res.data.cause){
            case "MISSING_COMPETENCES": message = "Bitte füge Kompetenzen hinzu."; break;
            case "CHILDREN_NOT_READY":  message = "Unteraufgaben sind noch nicht bereit."; break;
            case "TASK_NOT_READY":  message = "Bitte Felder ausfüllen (Beginn, Ende, Ort)"; break;
            default: message = "Anderer Fehler: " + res.data.cause;
          }
          $ionicPopup.alert({
            title: "Task kann nicht auf 'bereit' gesetzt werden",
            template: message,
            okType: "button-positive button-outline"
          })
        }
        $scope.load()
      }, function(error){
        console.log('An error occurred!', error);
        $ionicPopup.alert({
          title: "Task kann nicht auf 'bereit' gesetzt werden",
          template: "Fehler: "+ error.data.cause,
          okType: "button-positive button-outline"
        })
      })
    }
    $scope.readyToPublishTree = function(){
      TaskDataService.setReadyToPublishT($scope.task.id).then(function(res){
        if(!res.data.success){
          var message = "";
          switch(res.data.cause){
            case "CHILD_MISSING_COMPETENCES": message = "Eine Unteraufgabe benötigt noch Kompetenzen."; break;
            default: message = "Anderer Fehler: " + res.data.cause;
          }
          $ionicPopup.alert({
            title: "Task und Subtasks können nicht auf 'bereit' gesetzt werden",
            template: message,
            okType: "button-positive button-outline"
          })
        }
        $scope.load()
      }, function(error){
        console.log('An error occurred!', error);
        var message = "";
        switch(error.data.cause){
          case "CHILD_MISSING_COMPETENCES": message = "Eine Unteraufgabe benötigt noch Kompetenzen."; break;
          default: message = "Anderer Fehler: " + error.data.cause;
        }
        $ionicPopup.alert({
          title: "Task und Subtasks können nicht auf 'bereit' gesetzt werden",
          template: message,
          okType: "button-positive button-outline"
        })
      })
    }

    $scope.load();
  }])
