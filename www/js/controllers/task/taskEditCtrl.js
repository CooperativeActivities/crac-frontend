
/**
 * Created by md@x-net on 2017-01-31
 */
cracApp.controller('taskEditCtrl', ['$scope','$route', '$stateParams','TaskDataService','UserDataService', "$ionicHistory", "$q", "$ionicPopup", "$state",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,TaskDataService, UserDataService, $ionicHistory, $q, $ionicPopup, $state) {
    $scope.task= {};
    $scope.showPublish = false;
	$scope.showUnpublish = false;
	$scope.showDelete = false;
    $scope.isNewTask = true;
    $scope.formTitle = "";
    $scope.isChildTask = false;

    if($stateParams.id !== undefined) {
      $scope.isNewTask = false;
      $scope.taskId = $stateParams.id;
    }


    $scope.load = function(){
      if(!$scope.isNewTask){
        $scope.formTitle = "Aufgabe Bearbeiten";
        // @TODO: check if task.userIsLeading, if not, go back
        TaskDataService.getTaskById($scope.taskId).then(function (res) {
          var task = res.data;
          console.log("edit", task)
          if(!task) return;
          $scope.task = task;

          if($scope.task.startTime != $scope.task.endTime ){
            console.log('slot');
			$scope.timeChoice = 'slot';
            $scope.task.startTime = new Date($scope.task.startTime);
            $scope.task.endTime = new Date($scope.task.endTime);
          } else {
			console.log('point');
			$scope.timeChoice = 'point';
            $scope.task.startTime = new Date($scope.task.startTime);
            $scope.task.endTime = new Date($scope.task.endTime);
          }
		  
          $scope.updateFlags()
        }, function (error) {
          console.warn('An error occurred!', error);
        });
      } else {
        if($stateParams.parentId !== ''){
          $scope.isChildTask = true;
          $scope.formTitle = "Unteraufgabe Erstellen";
        } else {
          $scope.isChildTask = false;
          $scope.formTitle = "Aufgabe Erstellen";
        }


		$scope.task.taskType = 'ORGANISATIONAL';
		$scope.timeChoice = 'slot';
        if($stateParams.parentId !== ""){
          TaskDataService.getTaskById($stateParams.parentId).then(function(res){
            $scope.parentTask = res.data;
            $scope.task.startTime = new Date( $scope.parentTask.startTime);
            $scope.task.endTime = new Date ($scope.parentTask.endTime);
          },function(error){
            console.warn('An error occurred!', error);
          });
        } else {
			var now = new Date();
			now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
			now.setMinutes(0);
			now.setSeconds(0);
			now.setMilliseconds(0);
			$scope.task.startTime = now;
		}
      }
    };

    $scope.updateFlags = function(){
      var task = $scope.task;

      //initialize all flags to false
      $scope.showPublish =false;
      $scope.showUnpublish = false;
      $scope.showDelete = false;

      switch(task.taskState){
        case "COMPLETED":
          //disable all fields
          break;
        case "STARTED":
		  $scope.showUnpublish = true;
  		  $scope.showDelete = true;
          break;
        case "PUBLISHED":
          $scope.showUnpublish = true;
		  $scope.showDelete = true;
          break;
        case "NOT_PUBLISHED":
		  $scope.showPublish = $scope.task.superTask === null;
  		  $scope.showDelete = true;
          break;
      }
    };

    // Save task
    $scope.save = function(){
      var task = $scope.task;
      var taskData = {};
      if(!task.name){
        $ionicPopup.alert({
          title: "Task kann nicht gespeichert werden:",
          template: "Name muss angegeben werden.",
          okType: "button-positive button-outline"
        })
        return
      }
      taskData.name= task.name;

      // @TODO: ensure that startTime/endTime are within startTime/endTime of superTask



      if($scope.timeChoice == 'slot' ){
        task.startTime = new Date(task.startTime);
        task.endTime = new Date(task.endTime);
      } else {
        task.startTime = new Date(task.endTime);
        task.endTime = new Date(task.endTime);
      }


      /*var curDate = new Date();


      if(task.startTime.getTime() > task.endTime.getTime()){
        $ionicPopup.alert({
          title: "Task kann nicht gespeichert werden:",
          template: "Enddatum liegt vor Startdatum.",
          okType: "button-positive button-outline"
        });
        return
      }
      if(task.startTime.getTime() < curDate.getTime()){
        $ionicPopup.alert({
          title: "Task kann nicht gespeichert werden:",
          template: "Startdatum liegt vor aktullem Datum",
          okType: "button-positive button-outline"
        });
        return
      }

      //Check if subtask in the time of supertask
      if($scope.isChildTask){
        console.log('parent', $scope.parentTask );
        if($scope.parentTask.endTime < task.endTime.getTime()){
          $ionicPopup.alert({
            title: "Task kann nicht gespeichert werden:",
            template: "Enddatum von Unteraufgabe liegt nach Enddatum von Übergeordneter Aufgabe",
            okType: "button-positive button-outline"
          });
          return
        }
        if($scope.parentTask.startTime > task.startTime.getTime()){
          $ionicPopup.alert({
            title: "Task kann nicht gespeichert werden:",
            template: "Startdatum von Unteraufgabe liegt vor Startdatum von Übergeordneter Aufgabe",
            okType: "button-positive button-outline"
          });
          return
        }
      }*/

      if(task.startTime) taskData.startTime = task.startTime.getTime();
      if(task.endTime) taskData.endTime = task.endTime.getTime();
      if(task.description) taskData.description = task.description;
      if(task.location) taskData.location = task.location;
      if(task.minAmountOfVolunteers) taskData.minAmountOfVolunteers = task.minAmountOfVolunteers;
	  taskData.taskType = task.taskType;
	  
      var promise;
      if(!$scope.isNewTask){

        // @TODO: this shouldn't be necessary
        taskData.taskState = task.taskState;
        promise = $q.all([
          TaskDataService.updateTaskById(taskData, task.id),
        ]).then(function(res){
          // catch error of setCompetencesTask
          return res[0]
        })
      } else {
        if(!$scope.parentTask){
			promise = $q.all([
				TaskDataService.createNewTask(taskData)
			]).then(function(res) {
				return res;
			});
        } else {
			promise = $q.all([
				TaskDataService.createNewSubTask(taskData, $scope.parentTask.id)
			]).then(function(res) {
				return res;
			});
        }
	  }
      return promise.then(function (res) {
        return res;
      }, function(error) {
        console.log('An error occurred!', error);
        var message = "";
        if(error.data.cause){
          switch(error.data.cause){
              // @TODO: welche fehler gibt es hier?
            default: message = "Anderer Fehler: " + error.data.cause;
          }
        } else if(error.status == 403){
          message = "Du hast keine Berechtigungen Tasks zu speichern.";
        } else if(error.status == 500){
          message = "Server Fehler";
        }
        $ionicPopup.alert({
          title: "Task kann nicht gespeichert werden",
          template: message,
          okType: "button-positive button-outline"
        })
      });

    };

    // Save changes only
    $scope.save_changes = function() {
      $scope.save().then(function(save_res) {
        if(!save_res) return;
        var taskId = save_res[0].data.object.id;
        $ionicPopup.alert({
          title: "Task gespeichert",
          okType: "button-positive button-outline"
        })

        if($scope.isNewTask) {
			if($scope.task.taskType === 'ORGANISATIONAL') {			
			  // redirect to the edit page of the newly created org task
			  // (this could be handled even better, since backbutton now goes to the detail page of the parent, not of this task)
			  $state.go('tabsController.task', { id:taskId }, { location: "replace" }).then(function(res){
				$ionicHistory.removeBackView()
			  });
			} else {
			  // redirect to the advanced edit page of the newly created workable task
			  // (this could be handled even better, since backbutton now goes to the detail page of the parent, not of this task)
			  $state.go('tabsController.taskEditAdv', { id:taskId, section: 'competences' }, { location: "replace" }).then(function(res){
				$ionicHistory.removeBackView()
			  });
			}
        }
      })
    }

    $scope.save_and_publish = function(){
      $scope.save().then(function(save_res){
        if(!save_res || !save_res.data.success) return;
        var taskId = save_res.data.object.id;
        $scope.publish(taskId);
      })
    }
	
	$scope.save_and_unpublish = function(){
      $scope.save().then(function(save_res){
        if(!save_res || !save_res.data.success) return;
        $scope.unpublish();
      })
    }

	$scope.unpublish = function() {
		TaskDataService.changeTaskState($scope.taskId, 'unpublish').then(function(res) {
			if(res.data.success) {
				$state.go('tabsController.task', { id: $scope.taskId }, { location: 'replace' }).then(function(res) {
					$ionicHistory.removeBackView();
				});
			} else {
				var message = "";
				// @TODO implement actual error scenarios for unpublish
				switch(res.data.cause){
					//case "MISSING_COMPETENCES": message = "Bitte füge Kompetenzen hinzu."; break;
					//case "CHILDREN_NOT_READY":  message = "Unteraufgaben sind noch nicht bereit."; break;
					//case "TASK_NOT_READY":  message = "Aufgabe ist nicht bereit veröffentlicht zu werden."; break;
					default: message = "Anderer Fehler: " + res.data.cause;
				}
				
	            $ionicPopup.alert({
				  title: "Task kann nicht zurückziehen werden",
				  template: message,
				  okType: "button-positive button-outline"
				});
			}
		});
	}

    $scope.publish = function(taskId) {
      TaskDataService.changeTaskState(taskId, 'publish').then(function(res) {
        if(res.data.success){
          $state.go('tabsController.task', { id:taskId }, { location: "replace" }).then(function(res){
            $ionicHistory.removeBackView()
          });
        } else {
          var message = "";
          switch(res.data.cause){
            case "MISSING_COMPETENCES": message = "Bitte füge Kompetenzen hinzu."; break;
            case "CHILDREN_NOT_READY":  message = "Unteraufgaben sind noch nicht bereit."; break;
            case "TASK_NOT_READY":  message = "Aufgabe ist nicht bereit veröffentlicht zu werden."; break;
            default: message = "Anderer Fehler: " + res.data.cause;
          }

          if($scope.isNewTask) {
            $ionicPopup.show({
              title: "Task wurde erstellt und als 'bereit' gesetzt, kann aber nicht veröffentlicht werden.",
              template: message,
              buttons: [{
                text: 'OK',
                type: "button-positive button-outline",
                onTap: function(e) {
                  // redirect to the edit page of the newly created task
                  // (this could be handled even better, since backbutton now goes to the detail page of the parent, not of this task)
                  $state.go('tabsController.taskEdit', { id:taskId }, { location: "replace" }).then(function(res){
                    $ionicHistory.removeBackView()
                  });
                }
              }]
            })
          } else {
            $ionicPopup.alert({
              title: "Task kann nicht veröffentlicht werden",
              template: message,
              okType: "button-positive button-outline"
            })
          }
        }
      })
    }

	$scope.delete = function(){		
		var template = 'Wollen sie diese Task wirklich löschen? Es wird die Task mit ALLEN darunterliegenden Tasks permanent gelöscht.';
		if( $scope.task.taskState === 'PUBLISHED' )
			template += "<p><strong>Task is schon veröffentlicht. Task trotzdem löschen?</strong></p>";
		if( $scope.task.taskState === 'STARTED' )
			template += "<p><strong>Task is schon gestartet. Task trotzdem löschen?</strong></p>";

		var confirmPopup = $ionicPopup.confirm({
			title: 'Löschen',
			template: template,
			okText: "Löschen",
            okType: "button-assertive",
			cancelText: "Abbrechen"
		});

		confirmPopup.then(function(res) {
			if(res) {
			  TaskDataService.deleteTaskById($scope.task.id).then(function(res) {
                $state.go('tabsController.myTasks', { location: "replace" }).then(function(res){
                    $ionicHistory.removeBackView();
                });
			  }, function(error) {
				console.log('An error occurred!', error);
				alert(error.data.cause);
			  });
			}
		});
    }
	
	$scope.advancedEdit = function(section){
      $state.go('tabsController.taskEditAdv', { id: $scope.taskId, section: section });
    }


    $scope.load();
  }])
