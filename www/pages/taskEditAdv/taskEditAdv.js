cracApp.controller('taskEditAdvCtrl', ['$scope','$route', '$stateParams','TaskDataService','UserDataService','$ionicHistory','$q','ionicToast','$state',
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $route, $stateParams,TaskDataService, UserDataService, $ionicHistory, $q, ionicToast, $state) {
    $scope.view = $stateParams.section || 'competences';
	  $scope.task= {};
    $scope.isChildTask = false;

    $scope.competenceAreaList = [];
    $scope.competenceArea = -1;

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
        neededProficiencyLevel: 50
      },
      toAdd: [],
      toRemove: [],
      toUpdate: [],
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
        neededProficiencyLevel: 50
      };
      $scope.competences.toAdd = [];
      $scope.competences.toRemove = [];
      $scope.competences.toUpdate = [];
    };

    $scope.load = function(){
      // @TODO: check if task.userIsLeading, if not, go back
      TaskDataService.getTaskById($scope.taskId).then(function (res) {
        var task = res.object;
        console.log("edit", task);
        $scope.task = task;
        $scope.updateFlags();

        UserDataService.getCompetenceAreas()
          .then(function(res) {
            if(res.object.length === 0) {
              ionicToast.show("Keine Kompetenzbereiche gefunden: " + error.message, 'top', false, 5000);
              return;
            }

            var compAreas = res.object;
            compAreas.sort(function(a,b) {
              if(a.name < b.name) return -1;
              if(a.name > b.name) return 1;
              return 0;
            });
            $scope.competenceAreaList = compAreas;
          }, function(error) {
            ionicToast.show("Kompetenzbereiche können nicht geladen werden: " + error.message, 'top', false, 5000);
          });

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
        ionicToast.show("Aufgabe kann nicht geladen werden: " + error.message, 'top', false, 5000);
      });
    };

    $scope.onCompetenceAreaChange = function(newValue){
      if(newValue === -1) return;
      UserDataService.getCompetencesForArea(newValue)
        .then(function(res) {
          if(res.meta.competences.length === 0) {
            ionicToast.show("Keine Kompetenzen in diesem Bereich gefunden: " + '', 'top', false, 5000);
            return;
          }

          $scope.availableCompetences = res.meta.competences;
        }, function(error) {
          ionicToast.show("Kompetenzen dieses Bereichs können nicht geladen werden: " + error.message, 'top', false, 5000);
        });

    };

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
        ionicToast.show("Task kann nicht gespeichert werden:: " + "Name muss angegeben werden.", 'top', false, 5000);
        return
      }
      taskData.name= task.name;

      var promise;
      var competencesToAdd = $scope.competences.toAdd.map(function(competence){
        return {
          competenceId: competence.id,
          importanceLevel: competence.neededProficiencyLevel || 0,
          neededProficiencyLevel: competence.neededProficiencyLevel || 0,
          mandatory: competence.mandatory ? 1 : 0
        }
      });
      var competencesToUpdate = $scope.competences.toUpdate.map(function(competence){
        return {
          id: competence.id,
          importanceLevel: parseInt(competence.neededProficiencyLevel) || 0,
          neededProficiencyLevel: parseInt(competence.neededProficiencyLevel) || 0,
          mandatory: competence.mandatory ? 1 : 0
        }
      });
      var materialsToAdd = ($scope.materials.toAdd).map(function(material){
        return {
          name: material.name,
          description: material.description || "",
          quantity: material.quantity || 0
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
        promises.push(TaskDataService.createNewSubTask(shiftsToAdd[i], task.id));
      }
      for(var i=0; i<$scope.competences.toRemove.length; i++) {
        promises.push(TaskDataService.removeCompetenceFromTask(task.id, $scope.competences.toRemove[i]));
      }
      for(var i=0; i<competencesToUpdate.length; i++) {
        promises.push(TaskDataService.updateTaskCompetence(task.id, competencesToUpdate[i]));
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
        return res;
      });

      return promise.then(function (res) {
        //@TODO need to handle all elements, not just first
        $scope.resetObjects();
        $scope.load();
        return res[0];
      }, function(error) {
        ionicToast.show("Aufgabe kann nicht gespeichert werden: " + error.message, 'top', false, 5000);
        return false;
      });
    };

    // Save changes only
    $scope.save_changes = function() {
      $scope.save().then(function(save_res) {
        if(!save_res) return;

        ionicToast.show("Task gespeichert", 'top', false, 5000)
        $state.go('tabsController.task', { id:$scope.taskId }, { location: "replace" }).then(function(save_res){
          $ionicHistory.removeBackView();
        });
      });
    };

    $scope.save_and_publish = function(){
      $scope.save().then(function(save_res){
        if(!save_res) return;
        $scope.publish($scope.taskId);
      });
    };

    $scope.publish = function(taskId) {
      TaskDataService.changeTaskState(taskId, 'publish').then(function(res) {
        $state.go('tabsController.task', { id:taskId }, { location: "replace" }).then(function(res){
          $ionicHistory.removeBackView();
        });
      }, function(error) {
        ionicToast.show("Aufgabe kann nicht veröffentlicht werden: " + error.message, 'top', false, 5000);
      });
    };

    $scope.addCompetence = function(){
      var competenceId = $scope.competences.newObj.id;
      if(!competenceId) return;
      //save later
      var index = _.findIndex($scope.availableCompetences, { id: parseInt(competenceId) });
      if(index === -1){
        console.error("this shouldn't happen")
        return;
      }
      var competence = $scope.availableCompetences.splice(index, 1)[0];
      var newComp = {
        id: competenceId,
        name: competence.name,
        importanceLevel: $scope.competences.newObj.neededProficiencyLevel,
        neededProficiencyLevel: $scope.competences.newObj.neededProficiencyLevel,
        mandatory: $scope.competences.newObj.mandatory
      };

      $scope.competences.toAdd.push(newComp);
	    $scope.competences.all.push(newComp);
    };

    $scope.updateCompetence = function(competence){
      if(!competence) return;
      var index = _.findIndex($scope.competences.toUpdate, {id: competence.id});
      if(index < 0) {
        $scope.competences.toUpdate.push(competence);
      } else {
        $scope.competences.toUpdate[index] = competence;
      }
    };

    $scope.removeCompetence = function(competence){
      if(!competence) return;
      var index = _.findIndex($scope.competences.all, competence);
	    var newIndex = _.findIndex($scope.competences.toAdd, competence);
      $scope.competences.all.splice(index, 1)[0];
      if(newIndex < 0) {
        $scope.competences.toRemove.push(competence.id);
      } else {
        $scope.competences.toAdd.splice(newIndex, 1)[0];
      }
    };

    //material
    $scope.addMaterial = function(){
      if(!$scope.materials.newObj.name || !$scope.materials.newObj.quantity) {
        var message = "Bitte geben Sie ";
        if(!$scope.materials.newObj.name) {
          message += "den Namen ";
        }
        if(!$scope.materials.newObj.quantity){
          if(!$scope.materials.newObj.name) {
            message += "und ";
          }
          message += "die Menge";
        }
        message += " an!";
        ionicToast.show("Material konnte nicht hinzugefügt werden: " + message, 'top', false, 5000);
        return;
      }

      //save later
	    var newMaterial = _.clone($scope.materials.newObj);
      newMaterial.quantity = newMaterial.quantity || 1;
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
    };

    //shifts
    $scope.addShift = function() {

      if(!$scope.shifts.newObj.minAmountOfVolunteers){
          var message = 'Bitte geben Sie die Anzahl an Helfer an!';
          ionicToast.show("Schicht konnte nicht hinzugefügt werden: " + message, 'top', false, 5000);
        return;
      }

      if(!$scope.shifts.newObj.startTime || !$scope.shifts.newObj.endTime) return;
      var newShift = _.clone($scope.shifts.newObj);
      $scope.shifts.all.push(newShift);
      $scope.shifts.toAdd.push(newShift);
    };

    $scope.saveShift = function() {
     console.log('---Start Shift stuff ----');
      console.log($scope.shifts);
    };



    $scope.removeShift = function(shift){
      if(!shift) return;
      // var index = _.findIndex($scope.shifts.all, shift);
      // var newIndex = _.findIndex($scope.shifts.toAdd, shift);
      // $scope.shifts.all.splice(index, 1)[0];
      // if( newIndex < 0 ) {
      //   $scope.shifts.toRemove.push(shift.id);
      // } else {
      //   $scope.shifts.toAdd.splice(newIndex, 1)[0];
      // }

        TaskDataService.deleteTaskById(shift.id).then(function (res) {
            var message = 'Schicht wurde erfolgreich gelöscht';
            ionicToast.show("Schicht wurde gelöscht: " + message, 'top', false, 5000);
        }, function (error) {
            ionicToast.show("Schicht kann nicht gelöscht werden: " + error.message, 'top', false, 5000);
        });

        $scope.load();
    };

    $scope.load();
  }]);
