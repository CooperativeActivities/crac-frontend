cracApp.controller('taskEditAdvCtrl', ['$scope','$route', '$stateParams','TaskDataService','UserDataService', "$ionicHistory", "$q", "$ionicPopup", "$state",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,TaskDataService, UserDataService, $ionicHistory, $q, $ionicPopup, $state) {
    $scope.view = $stateParams.section || 'competences';
	$scope.task= {};
    $scope.isChildTask = false;

    $scope.competenceToAdd = {
      //defaults
    };
	
    $scope.taskId = $stateParams.id;
	$scope.materials = {
		newObj: {},
		toAdd: [],
		toRemove: [],
		all: []
	};
	$scope.shifts = {
		newObj: {},
		toAdd: [],
		toRemove: [],
		all: []
	};
	$scope.competences = {
		newObj: {
			importanceLevel: 50,
			neededProficiencyLevel: 50
		},
		toAdd: [],
		toRemove: [],
		all: []
	};

	$scope.resetObjects = function() {
		$scope.materials.newObj = {};
		$scope.materials.toAdd = [];
		$scope.materials.toRemove = [];
		$scope.shifts.newObj = {};
		$scope.shifts.toAdd = [];
		$scope.shifts.toRemove = [];
		$scope.competences.newObj = {
			importanceLevel: 50,
			neededProficiencyLevel: 50
		};
		$scope.competences.toAdd = [];
		$scope.competences.toRemove = [];
	};

    $scope.load = function(){
        // @TODO: check if task.userIsLeading, if not, go back
        TaskDataService.getTaskById($scope.taskId).then(function (res) {
          var task = res.data;
          console.log("edit", task)
          if(!task) return;
          $scope.task = task;

          $scope.updateFlags()
          TaskDataService.getAllAvailableCompetences(task.id).then(function(res){ return res.data })
            .then(function(availableCompetences){
              $scope.availableCompetences = availableCompetences;
            })
			
			task.startTime = new Date(task.startTime);
			task.endTime = new Date(task.endTime);
			
			$scope.competences.all = _.clone(task.taskCompetences);
			$scope.materials.all = _.clone(task.materials);
			$scope.shifts.newObj.startTime = task.startTime;
			$scope.shifts.newObj.endTime = task.endTime;
			$scope.shifts.all = _.clone(task.childTasks);
			
			for(var i=0; i<$scope.shifts.length; i++) {
				$scope.shifts[i].startTime = new Date($scope.shifts[i].startTime);
				$scope.shifts[i].endTime = new Date($scope.shifts[i].endTime);
			}
        }, function (error) {
          console.warn('An error occurred!', error);
        });
    }

    $scope.updateFlags = function(){
      var task = $scope.task;

      //initialize all flags to false
      $scope.showPublish =false;

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

      var promise;
      var competencesToAdd = $scope.competences.toAdd.map(function(competence){
        return {
          competenceId: competence.id,
          importanceLevel: competence.importanceLevel || 0,
          neededProficiencyLevel: competence.neededProficiencyLevel || 0,
          mandatory: competence.mandatory ? 1 : 0,
        }
      });
      var materialsToAdd = ($scope.materials.toAdd).map(function(material){
        return {
          name: material.name,
          description: material.description || "",
          quantity: material.quantity || 0,
        }
      });	  
	  var shiftsToAdd = ($scope.shifts.toAdd).map(function(shift) {
		  return {
			  taskType: 'SHIFT',
			  name: task.name,
			  minAmountOfVolunteers: shift.minAmountOfVolunteers,
			  startTime: shift.startTime.getTime(),
			  endTime: shift.endTime.getTime()
		  }
	  });
	  
		// @TODO: implement time shift add - new endpoint for batch adding
		var promises = [];
		
		if(competencesToAdd.length > 0 ) {
			promises.push(TaskDataService.addCompetencesToTask(task.id, competencesToAdd));
		}
		if(materialsToAdd.length > 0 ) {
			promises.push(TaskDataService.addMaterialsToTask(task.id, materialsToAdd));
		}
		for(var i=0; i<$scope.shifts.toAdd.length; i++) {
			promises.push(TaskDataService.createNewSubTask(shiftsToAdd, task.id));
		}
		for(var i=0; i<$scope.competences.toRemove.length; i++) {
			promises.push(TaskDataService.removeCompetenceFromTask(task.id, $scope.competences.toRemove[i]));
		}
		for(var i=0; i<$scope.materials.toRemove.length; i++) {
			promises.push(TaskDataService.removeMaterialFromTask(task.id, $scope.materials.toRemove[i]));
		}
		for(var i=0; i<$scope.shifts.toRemove.length; i++) {
			promises.push(TaskDataService.deleteTaskById($scope.shifts.toRemove[i].id));
		}
		
		if( promises.length === 0 ) {
			return false;
		}
		
        promise = $q.all(promises).then(function(res){
          // catch error of setCompetencesTask
          return res[0]
        })
		  
		  return promise.then(function (res) {
			$scope.resetObjects();
			$scope.load();
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
			});
		  });

    };

    // Save changes only
    $scope.save_changes = function() {
      $scope.save().then(function(save_res) {
        if(!save_res) return;
        $ionicPopup.alert({
          title: "Task gespeichert",
          okType: "button-positive button-outline"
        })
      })
    }

    $scope.save_and_publish = function(){
      $scope.save().then(function(save_res){
        if(!save_res || !save_res.data.success) return;
        $scope.publish($scope.taskId);
      })
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

    $scope.addCompetence = function(){
      var competenceId = $scope.competences.newObj.id;
      if(!competenceId) return;
      //save later
      var index = _.findIndex($scope.availableCompetences, { id: parseInt(competenceId) })
      if(index === -1){
        console.error("this shouldn't happen")
        return;
      }
      var competence = $scope.availableCompetences.splice(index, 1)[0];
	  var newComp = {
        id: competenceId,
        name: competence.name,
        importanceLevel: $scope.competences.newObj.importanceLevel,
        neededProficiencyLevel: $scope.competences.newObj.neededProficiencyLevel,
        mandatory: $scope.competences.newObj.mandatory
      };
	  
      $scope.competences.toAdd.push(newComp);
	  $scope.competences.all.push(newComp);
    };

    $scope.removeCompetence = function(competence){
      if(!competence) return;
      var index = _.findIndex($scope.competences.all, competence);
	  var newIndex = _.findIndex($scope.competences.toAdd, competence);
      $scope.competences.all.splice(index, 1)[0];
      $scope.availableCompetences.push({ name: competence.name, id: competence.id })
	  if(newIndex < 0) {
		$scope.competences.toRemove.push(competence.id);
	  } else {
		$scope.competences.toAdd.splice(newIndex, 1)[0];
	  }
    }

    //material
    $scope.addMaterial = function(){
      if(!$scope.materials.newObj.name) return;
      //save later
	  var newMaterial = _.clone($scope.materials.newObj);
      $scope.materials.all.push(newMaterial);
	  $scope.materials.toAdd.push(newMaterial);
      $scope.materials.newObj = {};
    };
    $scope.removeMaterial = function(material){
      if(!material) return;
      var index = _.findIndex($scope.materials.all, material);
	  var newIndex = _.findIndex($scope.materials.toAdd, material);
      $scope.materials.all.splice(index, 1)[0];
	  if(newIndex < 0) {
		  $scope.materials.toRemove.push(material.id);
	  } else {
		  $scope.materials.toAdd.splice(newIndex, 1)[0];
	  }
    }
	
	//shifts
	$scope.addShift = function() {
		if(!$scope.shifts.newObj.startTime || !$scope.shifts.newObj.endTime) return;
		var newShift = _.clone($scope.shifts.newObj);
		$scope.shifts.all.push(newShift);
		$scope.shifts.toAdd.push(newShift);
	}
    $scope.removeShift = function(shift){
      if(!shift) return;
	  var index = _.findIndex($scope.shifts.all, shift);
	  var newIndex = _.findIndex($scope.shifts.toAdd, shift);
	  $scope.shifts.all.splice(index, 1)[0];
	  if( newIndex < 0 ) {
		$scope.shifts.toRemove.push(shift.id);
	  } else {
		$scope.shifts.toAdd.splice(newIndex, 1)[0];
	  }
    }

    $scope.load();
  }])
