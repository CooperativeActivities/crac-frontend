
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
        var message = "";
        switch(error.data.cause){
            //welche fehler gibt es hier?
          default: message = "Anderer Fehler: " + error.data.cause;
        }
        $ionicPopup.alert({
          title: "Task kann nicht auf 'bereit' gesetzt werden",
          template: message,
          okType: "button-positive button-outline"
        })
      });
    };

    $scope.load = function(){
      TaskDataService.getTaskById($stateParams.id).then(function (res) {
        var task = res.data;
        if(!task) return;
        $q.all( [
          $q.all( task.mappedCompetences.map(function(comp){
            return UserDataService.getCompetenceById(comp.competence).then(function(res){ return res.data })
          })),
          TaskDataService.getAllAvailableCompetences(task.id).then(function(res){ return res.data })
        ]).then(function(competences){
          $scope.neededCompetences = competences[0];
          $scope.availableCompetences = competences[1];
          $scope.task = task;
          $scope.task.startTime = new Date($scope.task.startTime)
          $scope.task.endTime = new Date($scope.task.endTime)
          $scope.showPublish = $scope.task.taskState === "NOT_PUBLISHED" && $scope.task.superTask === null;
          $scope.showReadyToPublishSingle = $scope.task.taskState === "NOT_PUBLISHED";
          $scope.showReadyToPublishTree = $scope.task.taskState === "NOT_PUBLISHED" && $scope.task.childTasks.length > 0;
        })
      }, function (error) {
        console.log('An error occurred!', error);
      });
    };

    $scope.addCompetence = function(){
      if(!$scope.select.competenceToAdd) return;
      console.log($scope.select.competenceToAdd)
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
        $ionicHistory.goBack();
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
        console.log("ready", res);
      }, function(error){
        console.log('An error occurred!', error);
        var message = "";
        switch(error.data.cause){
          case "MISSING_COMPETENCES": message = "Bitte füge Kompetenzen hinzu."; break;
          case "CHILDREN_NOT_READY":  message = "Unteraufgaben sind noch nicht bereit."; break;
          default: message = "Anderer Fehler: " + error.data.cause;
        }
        $ionicPopup.alert({
          title: "Task kann nicht auf 'bereit' gesetzt werden",
          template: message,
          okType: "button-positive button-outline"
        })
      })
    }
    $scope.readyToPublishTree = function(){
      TaskDataService.setReadyToPublishT($scope.task.id).then(function(res){
        console.log(res);
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
