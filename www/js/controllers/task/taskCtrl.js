/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('singleTaskCtrl', ['$scope','$route', '$window', '$stateParams','$routeParams','TaskDataService','$state','$ionicPopup', "$q", "UserDataService",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope,$route, $window, $stateParams,$routeParams,TaskDataService,$state, $ionicPopup, $q, UserDataService) {

    //Flags to show/hide buttons
    $scope.editableFlag =false; // @TODO: check for permissions
    $scope.addSubTaskFlag =false;

    $scope.showEnroll =false;
    $scope.showCancel =false;
    $scope.showFollow = false;
    $scope.showUnfollow = false;
    $scope.showDelete = false;

    $scope.neededCompetences = [];

    $scope.doRefresh = function(){
      TaskDataService.getTaskById($stateParams.id).then(function (res) {
        var task = res.data;
        if(!task) return;
        $q.all(
          task.mappedCompetences.map(function(comp){
            return UserDataService.getCompetenceById(comp.competence).then(function(res){ return res.data })
          }).concat([ TaskDataService.getTaskRelatById($stateParams.id).then(function(res){
             // Get the Relationship between task and user
            return res.data[1].participationType
          },function(error){
            console.log("not participating", error)
            return "NOT_PARTICIPATING"
          }) ])
        ).then(function(competences){
          var relation = competences.pop();
          $scope.neededCompetences = competences;
          $scope.task = task;
          $scope.participationType = relation;
          $scope.updateFlags();
          $scope.$broadcast('scroll.refreshComplete');
        })
      })
    }

    $scope.doRefresh()


    $scope.updateFlags = function(){
      var relation = $scope.participationType,
        task = $scope.task,
        taskIsLeaf = task.childTasks.length < 1;

      //initialize all flags to false
      $scope.editableFlag =false;
      $scope.addSubTaskFlag =false;
      $scope.showDelete = false;

      $scope.showEnroll =false;
      $scope.showCancel =false;
      $scope.showFollow = false;
      $scope.showUnfollow = false;

      switch(task.taskState){
        case "COMPLETED":
          break;
        case "STARTED":
          if(relation !== "LEADING"){
            // @DISCUSS: cannot unfollow started task
            $scope.showFollow = relation !== "FOLLOWING";
            // @DISCUSS: we might remove that & allow participation on all tasks
            if(taskIsLeaf){
              $scope.showEnroll = relation !== "PARTICIPATING";
            }
          }
          break;
        case "PUBLISHED":

          if(relation !== "LEADING"){
            // @DISCUSS: we might remove that & allow participation on all tasks
            if(taskIsLeaf){
              $scope.showCancel = relation === "PARTICIPATING";
              $scope.showEnroll = !$scope.showCancel;
            }
            $scope.showUnfollow = relation === "FOLLOWING";
            $scope.showFollow = !$scope.showUnfollow && !$scope.showCancel;
          }
          // @TODO: check for permissions
          // if(task.userIsLeading){ //NYI
          $scope.editableFlag = true;
          $scope.addSubTaskFlag = !taskIsLeaf;
          break;
        case "NOT_PUBLISHED":
          // @TODO: check for permissions
          $scope.editableFlag = true;
          $scope.addSubTaskFlag = true;
          $scope.showDelete = true;
          break;
      }
    };

//To open another Task, e.g. SubTask
    $scope.loadSingleTask = function(taskId){
      $state.go('tabsController.task1', { id:taskId });
    }

// Deleting all participating types
    $scope.cancel = function() {
      //failsafe, so you dont accidentally cancel leading a task
      if($scope.participationType !== "LEADING"){
        TaskDataService.removeOpenTask($scope.task.id).then(function (res) {
          console.log("unfollowed/cancelled");
          $scope.participationType = "NOT_PARTICIPATING"
          $scope.updateFlags();
        }, function (error) {
          console.log('An error occurred!', error);
          alert(error.data.cause);
        });
      }
    }
    //enable editing-mode
    $scope.edit = function(){
      $state.go('tabsController.taskEdit', { id: $scope.task.id });
    };
    //Enroll for a task
    $scope.enroll = function(){
      TaskDataService.changeTaskPartState($stateParams.id ,'participate').then(function(res) {
        $scope.participationType = "PARTICIPATING"
        $scope.updateFlags();
        //$state.reload();
       // $window.location.reload();
      }, function(error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    }
// follow a task
    $scope.follow = function(){
      TaskDataService.changeTaskPartState($scope.task.id,'follow').then(function(res) {
        $scope.participationType = "FOLLOWING"
        $scope.updateFlags();
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

    $scope.makeNewSubTask = function(){
      $state.go('tabsController.newSubTask', { id:$scope.task.id });
    }
//Complete a task
    $scope.complete = function() {
      TaskDataService.changeTaskState($scope.task.id, 'complete').then(function (res) {
        TaskDataService.getTaskById($scope.task.id).then(function (res) {
          $scope.task = res.data;
          console.log($scope.task);
          $state.go('tabsController.tasklist');
        }, function (error) {
          console.log('An error occurred!', error);
        });
      }, function (error) {
        console.log('An error occurred!', error);
        alert(error.data.cause);
      });
    }
//Set a task as done
      $scope.done = function(){
        TaskDataService.setTaskDone($scope.task.id,"true").then(function () {
          console.log("works");
        }, function (error) {
          console.log('An error occurred!', error);
        });
      }

    $scope.addCompetence = function(){
      $state.go('tabsController.addCompetenceToTask', { id:$scope.task.id });
    }
  }])
