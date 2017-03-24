cracApp.controller('taskEditAdvCtrl', ['$scope','$route', '$stateParams','TaskDataService','UserDataService', "$ionicHistory", "$q", "$ionicPopup", "$state",
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,TaskDataService, UserDataService, $ionicHistory, $q, $ionicPopup, $state) {
    $scope.view = $stateParams.section || 'competences';
	$scope.task= {};
	$scope.shifts = [];
    $scope.isChildTask = false;

    $scope.competenceToAdd = {
      //defaults
      importanceLevel: 50,
      neededProficiencyLevel: 50
    };
    $scope.materialToAdd = {};
	$scope.shiftToAdd = {};
	$scope.shiftsToRemove = [];
    $scope.taskId = $stateParams.id;

    $scope.load = function(){
        // @TODO: check if task.userIsLeading, if not, go back
        TaskDataService.getTaskById($scope.taskId).then(function (res) {
          var task = res.data;
          console.log("edit", task)
          if(!task) return;
          $scope.task = task;

          $scope.neededCompetences = task.taskCompetences;

          $scope.updateFlags()
          TaskDataService.getAllAvailableCompetences(task.id).then(function(res){ return res.data })
            .then(function(availableCompetences){
              $scope.availableCompetences = availableCompetences;
            })
			
			task.startTime = new Date(task.startTime);
			task.endTime = new Date(task.endTime);
			$scope.shiftToAdd.startTime = task.startTime;
			$scope.shiftToAdd.endTime = task.endTime;
			$scope.shifts = task.childTasks;
			for(var i=0; i<$scope.shifts.length; i++) {
				$scope.shifts[i].startTime = new Date($scope.shifts[i].startTime);
				$scope.shifts[i].endTime = new Date($scope.shifts[i].endTime);
			}
        }, function (error) {
          console.warn('An error occurred!', error);
        });
        $scope.neededCompetences = [];
        $scope.task.materials = []
        TaskDataService.getAllCompetences().then(function(res){
          $scope.availableCompetences = res.data;
        }, function(error){
          console.warn('An error occurred!', error);
        })
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
      var neededCompetences = $scope.neededCompetences.map(function(competence){
        return {
          competenceId: competence.id,
          importanceLevel: competence.importanceLevel || 0,
          neededProficiencyLevel: competence.neededProficiencyLevel || 0,
          mandatory: competence.mandatory ? 1 : 0,
        }
      });
      var materials = ($scope.task.materials || []).map(function(material){
        return {
          name: material.name,
          description: material.description || "",
          quantity: material.quantity || 0,
        }
      });	  
	  var shifts = ($scope.shifts || []).map(function(shift) {
		  return {
			  id: shift.id,
			  taskType: 'SHIFT',
			  name: $scope.task.name,
			  startTime: shift.startTime,
			  endTime: shift.endTime
		  }
	  });
	  
        // @TODO: this shouldn't be necessary
        taskData.taskState = task.taskState;
		
		// @TODO: implement time shift add - new endpoint for batch adding
		var promises = [
			TaskDataService.setCompetencesTask(task.id, neededCompetences),
			TaskDataService.setMaterialsTask(task.id, materials)
		];
		for(var i=0; i<shifts.length; i++) {
			if(!shifts[i].id) {
				promises.push(TaskDataService.createNewSubTask(shifts[i], $scope.task.id));
			}
		}
		for(var i=0; i<$scope.shiftsToRemove.length; i++) {
			promises.push(TaskDataService.deleteTaskById($scope.shiftsToRemove[i]));
		}
		
        promise = $q.all(promises).then(function(res){
          // catch error of setCompetencesTask
          return res[0]
        })
		  
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
      var competenceId = $scope.competenceToAdd.id;
      if(!competenceId) return;
      //save later
      var index = _.findIndex($scope.availableCompetences, { id: parseInt(competenceId) })
      if(index === -1){
        console.error("this shouldn't happen")
        return;
      }
      var competence = $scope.availableCompetences.splice(index, 1)[0]
      $scope.neededCompetences.push({
        id: $scope.competenceToAdd.id,
        name: competence.name,
        importanceLevel: $scope.competenceToAdd.importanceLevel,
        neededProficiencyLevel: $scope.competenceToAdd.neededProficiencyLevel,
        mandatory: $scope.competenceToAdd.mandatory
      })
    };

    $scope.removeCompetence = function(competence){
      if(!competence) return;
      var competenceId = competence.id;
      var index = _.findIndex($scope.neededCompetences, { id: competenceId })
      $scope.neededCompetences.splice(index, 1)[0]
      $scope.availableCompetences.push({ name: competence.name, id: competence.id })
    }

    //material
    $scope.addMaterial = function(){
      if(!$scope.materialToAdd.name) return;
      //save later
      if(!$scope.task.materials){ $scope.task.materials = [] }
      $scope.task.materials.push(_.clone($scope.materialToAdd))
      $scope.materialToAdd = { };
    };
    $scope.removeMaterial = function(material){
      if(!material) return;
      var index = _.findIndex($scope.task.materials, material)
      $scope.task.materials.splice(index, 1)[0]
    }
	
	// @TODO implement shifts properly
	//shifts
	$scope.addShift = function() {
		if(!$scope.shiftToAdd.startTime || !$scope.shiftToAdd.endTime) return;
		$scope.shifts.push(_.clone($scope.shiftToAdd));
	}
    $scope.removeShift = function(shift){
      if(!shift) return;
	  var index = _.findIndex($scope.shifts, shift);
	  var id = $scope.shifts[index].id;
	  if(id) {
		$scope.shiftsToRemove.push(id);
	  }
	  
	  $scope.shifts.splice(index, 1)[0];
    }

    $scope.load();
  }])
