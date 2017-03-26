/**
 * Created by P41332 on 25.10.2016.
 */
// @TODO: move this to some global config file
var SUBTASKS_LIMITED_TO_SHALLOW = false;

cracApp.controller('singleTaskCtrl', ['$scope','$rootScope','$route', '$window', '$stateParams','$routeParams','TaskDataService','ErrorDisplayService','$state','$ionicPopup', "$q", "$ionicHistory",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope,$rootScope, $route, $window, $stateParams,$routeParams,TaskDataService,ErrorDisplayService, $state, $ionicPopup, $q, $ionicHistory) {

    //Flags to show/hide buttons
    $scope.editableFlag =false;
    $scope.addSubTaskFlag =false;

    $scope.showEnroll =false;
    $scope.showCancel =false;
    $scope.showFollow = false;
    $scope.showUnfollow = false;
    $scope.showPublish = false;

    $scope.team = [];
    $scope.neededCompetences = [];

    $scope.newComment = {name:'', content: ''};
    $scope.user = $rootScope.globals.currentUser.user;
    $scope.userIsDone = false;
    $scope.allAreDone = false;

    $scope.doRefresh = function(){
      TaskDataService.getTaskById($stateParams.id).then(function (res) {
		// @TODO: object not structured correctly
		// if( !res || !res.success ) {
		if( !res || !res.data || res.status != 200 ) {
			ErrorDisplayService.showError(
				res,
				"Aufgabe kann nicht geladen werden"
			);
		}
		
        var task = res.data;
        console.log("task detail view", task);

        task.userRelationships.sort($scope.sortMemberListByRelationship);

        TaskDataService.getTaskRelatById($stateParams.id).then(function(res){
			// @TODO: object not structured correctly
			// if( !res || !res.success ) {
			if( !res || !res.data || res.status != 200 ) {
				console.warn("Could not retrieve user-task relationships");
				return;
			}
			$scope.participationType = res.data[1].participationType;
			$scope.userIsDone = res.data[1].completed;
        }, function(error) {
			//@TODO this should probably be handled differently
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
        taskIsWorkable = task.taskType === 'WORKABLE';
		taskHasShifts = task.childTasks.length > 0 && taskIsWorkable;
		

      //initialize all flags to false
      $scope.editableFlag =false;
      $scope.addSubTaskFlag =false;
      $scope.showPublish = false;

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
			  // @TODO allow leaders to also participate/follow
			$scope.editableFlag = true;
		  } else {
            // @DISCUSS: cannot unfollow started task?
			$scope.showEnroll = relation !== "PARTICIPATING" && !taskHasShifts;
			$scope.showFollow = relation !== "FOLLOWING" && relation !== "PARTICIPATING";
			$scope.showCancel = relation === "PARTICIPATING";
		  }
          break;
        case "PUBLISHED":
          if(relation === "LEADING"){
			  // @TODO allow leaders to also participate/follow
			$scope.editableFlag = true;
			$scope.addSubTaskFlag = $scope.task.taskType === 'ORGANISATIONAL' && (!SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask);
		  } else {
			$scope.showEnroll = relation !== "PARTICIPATING" && !taskHasShifts;
			$scope.showFollow = relation !== "FOLLOWING" && relation !== "PARTICIPATING";
			$scope.showCancel = relation === "PARTICIPATING";
            $scope.showUnfollow = relation === "FOLLOWING";
		  } 
          break;
        case "NOT_PUBLISHED":
          if($scope.participationType === 'LEADING'){
			$scope.editableFlag = true;
			$scope.showPublish = true;
			$scope.addSubTaskFlag = $scope.task.taskType === 'ORGANISATIONAL' && !SUBTASKS_LIMITED_TO_SHALLOW || !taskIsSubtask;
		  }
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
			if( !res || !res.data.success ) {
				ErrorDisplayService.showError(
					res,
					"Aufgabe kann nicht abgesagt werden"
				);
				return;
			}
			
			console.log("unfollowed/cancelled");
			$scope.participationType = "NOT_PARTICIPATING"
			$scope.updateFlags();
        }, function (error) {
			ErrorDisplayService.showError(
				error,
				"Aufgabe kann nicht abgesagt werden"
			);
        });
      }
    }
    //enable editing-mode
    $scope.edit = function(){
      $state.go('tabsController.taskEdit', {id: $scope.task.id}, {reload: true});
    };
    //Enroll for a task
    $scope.enroll = function(){
		if( $scope.task.taskType === 'WORKABLE' && $scope.task.childTasks.length > 0 ) {
			//if a task has shifts, general enrolment is forbidden, this shouldn't happen
			return;
		}
		
      TaskDataService.changeTaskPartState($stateParams.id ,'participate').then(function(res) {
		if( !res || !res.data.success ) {
			ErrorDisplayService.showError(
				res,
				"Aufgabe kann nicht teilgenommen werden"
			);
			return;
		}
		
        $scope.participationType = "PARTICIPATING"
        $scope.updateFlags();
        //$state.reload();
        // $window.location.reload();
      }, function(error) {
		ErrorDisplayService.showError(
			error,
			"Aufgabe kann nicht teilgenommen werden"
		);
      });
    }
	//add self to a shift
	$scope.addToShift = function(shift) {
		TaskDataService.changeTaskPartState(shift.id ,'participate').then(function(res) {
			if( !res || !res.data.success ) {
				ErrorDisplayService.showError(
					res,
					"Schicht kann nicht teilgenommen werden"
				);
				return;
			}
			console.log('Participating in shift ' + shift.id);
		}, function(error) {
			ErrorDisplayService.showError(
				error,
				"Schicht kann nicht teilgenommen werden"
			);
		});
	};
	//remove self from shift
	$scope.removeFromShift = function(shift) {
        TaskDataService.removeOpenTask(shift.id).then(function (res) {
			if( !res || !res.data.success ) {
				ErrorDisplayService.showError(
					res,
					"Schicht kann nicht zurückgezogen werden"
				);
				return;
			}
			console.log('Not participating in shift ' + shift.id);
		}, function(error) {
			ErrorDisplayService.showError(
				error,
				"Schicht kann nicht zurückgezogen werden"
			);
		});

	};
    // follow a task
    $scope.follow = function(){
      TaskDataService.changeTaskPartState($scope.task.id,'follow').then(function(res) {
		if( !res || !res.data.success ) {
			ErrorDisplayService.showError(
				res,
				"Aufgabe kann nicht gefolgt werden"
			);
			return;
		}
        $scope.participationType = "FOLLOWING"
        $scope.updateFlags();
      }, function(error) {
		ErrorDisplayService.showError(
			error,
			"Aufgabe kann nicht gefolgt werden"
		);
      });
    };

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
                return;
              }
              else {
                $scope.forceComplete();
              }
            });
          } else {
			ErrorDisplayService.showError(
				res,
				"Aufgabe kann nicht abgeschlossen werden"
			);
          }
          return;
        }
        console.log("Task is completed");
        $scope.task.taskState = 'COMPLETED';
        $scope.updateFlags();
        console.log(res);
      }, function (error) {
		ErrorDisplayService.showError(
			res,
			"Aufgabe kann nicht abgeschlossen werden"
		);
      });
    }
    //Set a task as done
    $scope.done = function(){
		if(!$scope.participationType !== "PARTICIPATING") return false;

		TaskDataService.setTaskDone($scope.task.id,"true").then(function (res) {
			if( !res || !res.data.success ) {
				ErrorDisplayService.showError(
					res,
					"Aufgabe kann nicht als fertig markiert werden"
				);
				return;
			}

			console.log("Task is done");
			$scope.userIsDone = true;
			$scope.allAreDone = $scope.areAllParticipantsDone();
		}, function (error) {
			ErrorDisplayService.showError(
				res,
				"Aufgabe kann nicht als fertig markiert werden"
			);
		});
    }
    //unset task as done
    $scope.notDone = function() {
		if(!$scope.participationType !== "PARTICIPATING") return false;

		TaskDataService.setTaskDone($scope.task.id,"false").then(function (res) {
			if( !res || !res.data.success ) {
				ErrorDisplayService.showError(
					res,
					"Aufgabe kann nicht gelost werden"
				);
				return;
			}
			$scope.userIsDone = false;
			$scope.allAreDone = false;
		}, function (error) {
			ErrorDisplayService.showError(
				res,
				"Aufgabe kann nicht gelost werden"
			);
		});
    }
	
	$scope.publish = function() {
		if( !$scope.task.readyToPublish ) {
			// @TODO - display popup with reason(s) why it's not ready
			/*
			var message = "";
			$ionicPopup.alert({
				title: "Task kann nicht veröffentlicht werden",
				template: message,
				okType: "button-positive button-outline"
			})*/
			return;
		}

		var taskId = $scope.task.id;
		TaskDataService.changeTaskState(taskId, 'publish').then(function(res) {
			if( !res || !res.data.success ) {
				ErrorDisplayService.showError(
					res,
					"Aufgabe kann nicht veröffentlicht werden"
				);
				return;
			}
			
			$ionicPopup.alert({
			  title: "Task veröffentlicht",
			  okType: "button-positive button-outline"
			})
			$scope.showPublish = false;
		}, function(error) {
			ErrorDisplayService.showError(
				error,
				"Aufgabe kann nicht veröffentlicht werden"
			);
		});
    }

    $scope.addCompetence = function(){
      $state.go('tabsController.addCompetenceToTask', { id:$scope.task.id });
    }

    //Add a new comment to the task
    $scope.addNewComment = function() {
      if(!$scope.newComment.content) return false;
      $scope.newComment.name = $scope.user;
      TaskDataService.addComment($scope.task.id,$scope.newComment).then(function (res) {
		// @TODO: object not structured correctly
		// if( !res || !res.success ) {
		if( !res || !res.data || res.status != 200 ) {
			ErrorDisplayService.showError(
				res,
				"Kommentar kann nicht hinzufügen werden"
			);
			return;
		}
		
        console.log("comment added");
        $scope.newComment = {name:'', content: ''};
        $scope.doRefresh();
      }, function (error) {
		ErrorDisplayService.showError(
			error,
			"Kommentar kann nicht hinzufügen werden"
		);
      });
    }

    //Delete a comment from the task
    $scope.removeComment = function(comment) {
      if($scope.user !== comment.name) return false;
      TaskDataService.removeComment($scope.task.id,comment.id).then(function (res) {
		// @TODO: object not structured correctly
		// if( !res || !res.success ) {
		if( !res || !res.data || res.status != 200 ) {
			ErrorDisplayService.showError(
				res,
				"Kommentar kann nicht gelöscht werden"
			);
			return;
		}

        console.log("comment removed");
        $scope.doRefresh();
      }, function (error) {
		ErrorDisplayService.showError(
			res,
			"Kommentar kann nicht gelöscht werden"
		);
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
		if( material.subscribedQuantity === 0 ) {
			$scope.unsubscribe(material);
			return;
		}
		
		TaskDataService.subscribeToMaterial($scope.task.id, material.id, material.subscribedQuantity).then(function(res){
			if( !res || !res.data.success ) {
				ErrorDisplayService.showError(
					res,
					"Materialien können nicht gespeichert werden"
				);
				return;				
			}
			console.log("Material subscribed");
		}, function(error){
			ErrorDisplayService.showError(
				error,
				"Materialien können nicht gespeichert werden"
			);
		});
    };
    $scope.unsubscribe = function(material){
		TaskDataService.unsubscribeFromMaterial($scope.task.id, material.id).then(function(res){
			if(!res || !res.data.success){
				ErrorDisplayService.showError(
					res,
					"Materialien können nicht gespeichert werden"
				);
				return;
			}
			
			console.log("Material unsubscribed");
		}, function(error){
			ErrorDisplayService.showError(
				error,
				"Materialien können nicht gespeichert werden"
			);
		})
    };

  }])
