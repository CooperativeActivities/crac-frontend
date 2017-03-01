/**
 * Created by P41332 on 25.10.2016.
 */
// @TODO: move this to some global config file
var SUBTASKS_LIMITED_TO_SHALLOW = false;

cracApp.controller('singleTaskCtrl', ['$scope','$rootScope','$route', '$window', '$stateParams','$routeParams','TaskDataService','$state','$ionicPopup', "$q", "$ionicHistory",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope,$rootScope, $route, $window, $stateParams,$routeParams,TaskDataService,$state, $ionicPopup, $q, $ionicHistory) {

    //Flags to show/hide buttons
    $scope.editableFlag =false;
    $scope.addSubTaskFlag =false;

    $scope.showEnroll =false;
    $scope.showCancel =false;
    $scope.showFollow = false;
    $scope.showUnfollow = false;
    $scope.showDelete = false;

    $scope.team = [];
    $scope.neededCompetences = [];

    $scope.newComment = {name:'', content: ''};
    $scope.user = $rootScope.globals.currentUser.user;
    $scope.userIsDone = false;
    $scope.allAreDone = false;

    $scope.doRefresh = function(){
      TaskDataService.getTaskById($stateParams.id).then(function (res) {
        var task = res.data;
        console.log("task detail view", task);
        if(!task) return;

        task.userRelationships.sort($scope.sortMemberListByRelationship);

        TaskDataService.getTaskRelatById($stateParams.id).then(function(res){
          $scope.participationType = res.data[1].participationType;
          $scope.userIsDone = res.data[1].completed;
        }, function(error) {
          $scope.participationType = 'NOT_PARTICIPATING';
        }).then(function() {
          $scope.neededCompetences = task.taskCompetences;
          $scope.task = task;
          $scope.updateFlags();
          $scope.$broadcast('scroll.refreshComplete');
        });
      })
    }

    $scope.doRefresh()

    $scope.areAllParticipantsDone = function() {
      for(var i=0; i<$scope.task.userRelationships.length; i++) {
        var u = $scope.task.userRelationships[i];
        if( u.participationType === "PARTICIPATING" && !u.completed ) {
          return false;
        }
      }

      return true;
    }

    $scope.sortMemberListByRelationship = function(a,b) {
      if(b.participationType === "LEADING") {
        return 1;
      }
      if(b.friend) {
        return 1;
      }
      return 0;
    }

    $scope.updateFlags = function(){
      var relation = $scope.participationType,
        task = $scope.task,
        taskIsLeaf = task.childTasks.length < 1,
        taskIsSubtask = task.superTask !== null;

      //initialize all flags to false
      $scope.editableFlag =false;
      $scope.addSubTaskFlag =false;
      $scope.showDelete = false;

      $scope.showEnroll =false;
      $scope.showCancel =false;
      $scope.showFollow = false;
      $scope.showUnfollow = false;
      $scope.allAreDone = $scope.areAllParticipantsDone();

      switch(task.taskState){
        case "COMPLETED":
          break;
        case "STARTED":
          if(relation === "LEADING"){
  			$scope.showDelete = true;
		  } else {
            // @DISCUSS: cannot unfollow started task
            if(relation !== "PARTICIPATING") {
              $scope.showFollow = relation !== "FOLLOWING";
            }
            // @DISCUSS: we might remove that & allow participation on all tasks
            if(taskIsLeaf){
              $scope.showEnroll = relation !== "PARTICIPATING";
            }
		  }
          break;
        case "PUBLISHED":
          if(relation === "LEADING"){
			$scope.editableFlag = true;
			$scope.showDelete = true;
		  } else {
            // @DISCUSS: we might remove that & allow participation on all tasks
            if(taskIsLeaf){
              $scope.showCancel = relation === "PARTICIPATING";
              $scope.showEnroll = !$scope.showCancel;
            }
            if(!relation !== "PARTICIPATING") {
              $scope.showUnfollow = relation === "FOLLOWING";
              $scope.showFollow = !$scope.showUnfollow && !$scope.showCancel;
            }
          }
          $scope.addSubTaskFlag = !taskIsLeaf && (!SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask);
          break;
        case "NOT_PUBLISHED":
          if($scope.participationType === 'LEADING'){
			$scope.editableFlag = true;
			$scope.showDelete = true;
		  }
          $scope.addSubTaskFlag = !SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask;
          break;
      }
    };

    //To open another Task, e.g. SubTask
    $scope.loadSingleTask = function(taskId){
      $state.go('tabsController.task', { id:taskId });
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
		if( $scope.participationType !== 'LEADING' ) return false;
		
		var confirmPopup = $ionicPopup.confirm({
			title: 'Löschen',
			template: 'Wollen sie diese Task wirklich löschen? Es wird die Task mit ALLEN darunterliegenden Tasks permanent gelöscht.'
		});

		confirmPopup.then(function(res) {
			if(res) {
			  TaskDataService.deleteTaskById($scope.task.id).then(function(res) {
				$ionicHistory.goBack();
			  }, function(error) {
				console.log('An error occurred!', error);
				alert(error.data.cause);
			  });
			}
		});
    }

    //Set the task and all task under this one to ready to publish (only possible if every input field is filled out correctly)
    $scope.readyToPublishT = function() {
		if( $scope.participationType !== 'LEADING' ) return false;

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
		if( $scope.participationType !== 'LEADING' ) return false;

		TaskDataService.setReadyToPublishS($scope.task.id).then(function(res) {
			console.log('worksS');
			console.log(res.data);
		}, function(error) {
			console.log('An error occurred!', error);
			alert(error.data.cause);
		});
    }

    $scope.makeNewSubTask = function(){
      $state.go('tabsController.newTask', { parentId: $scope.task.id });
    }
    //Complete a task
    $scope.complete = function() {
      $scope.completeTask('complete');
    }
    $scope.forceComplete = function() {
      $scope.completeTask('forceComplete');
    }

    $scope.completeTask = function(state) {
      if(!$scope.participationType !== "LEADING") return false;

      TaskDataService.changeTaskState($scope.task.id, state).then(function (res) {
        if(res.data.error) {
          console.log('Error: ', res.data.cause);
          if( res.data.cause === 'NOT_COMPLETED_BY_USERS' ) {
            $ionicPopup.confirm({
              title: "Task kann nicht als fertig markiert werden:",
              template: "Noch nicht alle Teilnehmer haben die Task als fertig markiert. Task trotzdem abschließen?",
              okText: "Abschließen",
              cancelText: "Abbrechen"
            }).then(function(res) {
              if( !res ) {
                return false;
              }
              else {
                $scope.forceComplete();
              }
            });
          } else {
            console.log('Error: ', res.data.cause);
            $ionicPopup.alert({
              title: "Task kann nicht abgeschlossen werden:",
              template: res.data.cause,
              okType: "button-positive button-outline"
            });
          }
          return;
        }
        console.log("Task is completed");
        $scope.task.taskState = 'COMPLETED';
        $scope.updateFlags();
        console.log(res);
      }, function (error) {
        console.log('Error: ', error);
        $ionicPopup.alert({
          title: "Task kann nicht abgeschlossen werden:",
          template: error,
          okType: "button-positive button-outline"
        });
      });
    }
    //Set a task as done
    $scope.done = function(){
		if(!$scope.participationType !== "PARTICIPATING") return false;

		TaskDataService.setTaskDone($scope.task.id,"true").then(function (res) {
			if(res.data.error) {
			  console.log('Error: ', res.data.cause);
			  return;
			}

			console.log("Task is done");
			$scope.userIsDone = true;
			$scope.allAreDone = $scope.areAllParticipantsDone();
		}, function (error) {
			console.log('An error occurred!', error);
		});
    }
    //unset task as done
    $scope.notDone = function() {
		if(!$scope.participationType !== "PARTICIPATING") return false;

		TaskDataService.setTaskDone($scope.task.id,"false").then(function (res) {
			console.log("Task is no longer done");
			$scope.userIsDone = false;
			$scope.allAreDone = false;
		}, function (error) {
			console.log('An error occurred!', error);
		});
    }

    $scope.addCompetence = function(){
      $state.go('tabsController.addCompetenceToTask', { id:$scope.task.id });
    }

    //Add a new comment to the task
    $scope.addNewComment = function() {
      if(!$scope.newComment.content) return false;
      $scope.newComment.name = $scope.user;
      TaskDataService.addComment($scope.task.id,$scope.newComment).then(function () {
        console.log("comment added");
        $scope.newComment = {name:'', content: ''};
        $scope.doRefresh();
      }, function (error) {
        console.log('An error occurred! ', error);
      });
    }

    //Delete a comment from the task
    $scope.removeComment = function(comment) {
      if($scope.user !== comment.name) return false;
      TaskDataService.removeComment($scope.task.id,comment.id).then(function () {
        console.log("comment removed");
        $scope.doRefresh();
      }, function (error) {
        console.log('An error occurred! ', error);
      });
    }
    //Check if user is the owner of the comment
    $scope.checkCommentOwner = function(name){
      if(name === $rootScope.globals.currentUser.user){
        return true;
      }
      return false;
    };

    //Check if task has a location
    $scope.checkLocation = function(location){
      if(location == null){
        return false
      }
      return true;
    };

    $scope.getCompetenceColors = function(competence){
      var competenceUserRel = _.find($rootScope.globals.userInfoCompetences, function(rel){
        return rel.competence.id === competence.id
      })
      if(competenceUserRel){
        // likeValue = competenceUserRel.likeValue
        // proficiencyValue = competenceUserRel.proficiencyValue
      } else {
      }
      var hueLowImportance = 120 // green
        , hueHighImportance = 0 // blue
      var saturationLowProficiency = 90 // brighter
        , saturationHighProficiency = 65 // darker
      var hue = hueLowImportance + (competence.importanceLevel / 100 * (hueHighImportance - hueLowImportance))
      var saturation = saturationLowProficiency + (competence.neededProficiencyLevel / 100 * (saturationHighProficiency - saturationLowProficiency))
      return { "background-color":"hsl("+ Math.floor(hue) +",100%,"+ Math.floor(saturation) +"%)" }
    };

    $scope.subscribe = function(material){
      TaskDataService.subscribeToMaterial($scope.task.id, material.id, material.subscribedQuantity).then(function(res){
        if(!res.data.success){
          return alert(res.data.cause)
        }
      }, function(err){
        console.log(err)
      })
    }
    $scope.unsubscribe = function(material){
      TaskDataService.unsubscribeFromMaterial($scope.task.id, material.id).then(function(res){
        if(!res.data.success){
          return alert(res.data.cause)
        }
        material.subscribedQuantity = 0
      }, function(err){
        console.log(err)
      })
    }

  }])
