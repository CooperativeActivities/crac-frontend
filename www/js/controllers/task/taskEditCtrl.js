
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
    $scope.showReadyToPublishSingle = false;
    $scope.showReadyToPublishTree = false;
    $scope.isNewTask = true;
    $scope.formTitle = "";
    $scope.isChildTask = false;

    $scope.competenceToAdd = {
      //defaults
      importanceLevel: 50,
      neededProficiencyLevel: 50
    };
    $scope.materialToAdd = {};

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
          TaskDataService.getAllAvailableCompetences(task.id).then(function(res){ return res.data })
            .then(function(availableCompetences){
              $scope.neededCompetences = task.taskCompetences;
              $scope.availableCompetences = availableCompetences;
              $scope.task = task;

              if($scope.task.choice == 'slot' ){
                console.log('slot');
                $scope.task.startTime = new Date($scope.task.startTime);
                $scope.task.endTime = new Date($scope.task.endTime);
              } else {
                $scope.task.startTime = new Date($scope.task.startTime);
                $scope.task.endTime = new Date($scope.task.endTime);
              }

              $scope.updateFlags()
            })
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


        $scope.neededCompetences = [];
        $scope.task.materials = []
        TaskDataService.getAllCompetences().then(function(res){
          $scope.availableCompetences = res.data;
        }, function(error){
          console.warn('An error occurred!', error);
        })
        if($stateParams.parentId !== ""){
          TaskDataService.getTaskById($stateParams.parentId).then(function(res){
            $scope.parentTask = res.data;
            $scope.task.startTime = new Date( $scope.parentTask.startTime);
            $scope.task.endTime = new Date ($scope.parentTask.endTime);
          },function(error){
            console.warn('An error occurred!', error);
          });
        }
      }
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



      if(task.choice == 'slot' ){
        task.startTime = new Date(task.startTime);
        task.endTime = new Date(task.endTime);
      } else {
        task.startTime = new Date(Date.now());
        task.endTime = new Date(task.endTime);
      }


      var curDate = new Date();


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
      }



      if(task.startTime) taskData.startTime = task.startTime.getTime();
      if(task.endTime) taskData.endTime = task.endTime.getTime();




      if(task.description) taskData.description = task.description;
      if(task.location) taskData.location = task.location;
      if(task.minAmountOfVolunteers) taskData.minAmountOfVolunteers = task.minAmountOfVolunteers;




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
      if(!$scope.isNewTask){

        // @TODO: this shouldn't be necessary
        taskData.taskState = task.taskState;
        promise = $q.all([
          TaskDataService.updateTaskById(taskData, task.id),
          TaskDataService.setCompetencesTask(task.id, neededCompetences),
          TaskDataService.setMaterialsTask(task.id, materials)
        ]).then(function(res){
          // catch error of setCompetencesTask
          return res[0]
        })
      } else {
        var creation_promise;
        if(!$scope.parentTask){
          creation_promise = TaskDataService.createNewTask(taskData)
        } else {
          creation_promise = TaskDataService.createNewSubTask(taskData, $scope.parentTask.id)
        }
        promise = $q(function(resolve, reject){
          creation_promise.then(function(creation_res){
            var taskId = creation_res.data.task
            $q.all([
              TaskDataService.addCompetencesToTask(taskId, neededCompetences),
              TaskDataService.addMaterialsToTask(task.id, materials),
            ]).then(function(competences_and_material_res){
              resolve(creation_res)
            }, reject)
          }, reject)
        })
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
    /*$scope.save_and_back = function(){
      $scope.save().then(function(save_res){
        var taskId = save_res.data.task;
        if($scope.isNewTask){
          $state.go('tabsController.task', { id:taskId }, { location: "replace" }).then(function(res){
            $ionicHistory.removeBackView()
          });
        } else {
          $ionicHistory.goBack();
        }
      })
    }*/

    // Save changes only
    $scope.save_changes = function() {
      $scope.save().then(function(save_res) {
        if(!save_res) return;
        var taskId = save_res.data.task;
        $ionicPopup.alert({
          title: "Task gespeichert",
          okType: "button-positive button-outline"
        })

        if($scope.isNewTask) {
          // redirect to the edit page of the newly created task
          // (this could be handled even better, since backbutton now goes to the detail page of the parent, not of this task)
          $state.go('tabsController.taskEdit', { id:taskId }, { location: "replace" }).then(function(res){
            $ionicHistory.removeBackView()
          });
        }
      })
    }

    $scope.save_and_publish = function(){
      $scope.save().then(function(save_res){
        if(!save_res || !save_res.data.success) return;
        var taskId = save_res.data.task;

        if(!$scope.task.readyToPublish) {
          $scope.setAsReady(taskId).then(function(ready_res) {
            if(!ready_res || !ready_res.data.success) {
              if($scope.isNewTask) {
                switch(ready_res.data.cause){
                  case "MISSING_COMPETENCES": message = "Bitte füge Kompetenzen hinzu."; break;
                  case "CHILDREN_NOT_READY":  message = "Unteraufgaben sind noch nicht bereit."; break;
                  case "TASK_NOT_READY":  message = "Bitte Felder ausfüllen (Beginn, Ende, Ort)"; break;
                  default: message = "Anderer Fehler: " + res.data.cause;
                }
                //server doesn't respond correctly
                message = "Bitte füge Kompetenzen/Unteraufgaben hinzu oder setze Unteraufgaben auf 'bereit'.";
                $ionicPopup.show({
                  title: "Task wurde erstellt, kann aber nicht veröffentlicht werden.",
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
              }
              return;
            }
            $scope.publish(taskId);
          });
        } else {
          $scope.publish(taskId);
        }
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


    //publish task
    /*$scope.publish = function(){
      if($scope.newTask){ return }
      TaskDataService.changeTaskState($scope.task.id, 'publish').then(function(res) {
        if(!res.data.success){
          var message = "";
          switch(res.data.cause){
            case "MISSING_COMPETENCES": message = "Bitte füge Kompetenzen hinzu."; break;
            case "CHILDREN_NOT_READY":  message = "Unteraufgaben sind noch nicht bereit."; break;
            case "TASK_NOT_READY":  message = "Bitte Felder ausfüllen (Beginn, Ende, Ort)"; break;
            default: message = "Anderer Fehler: " + res.data.cause;
          }
          $ionicPopup.alert({
            title: "Task kann nicht veröffentlicht werden",
            template: message,
            okType: "button-positive button-outline"
          })
        }
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
    }*/

    // Set task as ready
    $scope.setAsReady = function(taskId){
      var task = $scope.task;
      var taskData = {};

      var promise = TaskDataService.setReadyToPublishS(taskId);

      return promise.then(function (res) {
        return res;
      }, function(error) {
        console.log('An error occurred!', error);
        $ionicPopup.alert({
          title: "Task kann nicht auf 'bereit' gesetzt werden",
          template: "Fehler: "+ error.data.cause,
          okType: "button-positive button-outline"
        })
        return error;
      });
    };

    $scope.readyToPublish = function(){
      $scope.save().then(function(save_res){
        if(!save_res || !save_res.data.success) return;
        var taskId = save_res.data.task;
        $scope.setAsReady(taskId).then(function(res) {
          if(!res.data.success){
            var message = "";
            switch(res.data.cause){
              case "MISSING_COMPETENCES": message = "Bitte füge Kompetenzen hinzu."; break;
              case "CHILDREN_NOT_READY":  message = "Unteraufgaben sind noch nicht bereit."; break;
              case "TASK_NOT_READY":  message = "Bitte Felder ausfüllen (Beginn, Ende, Ort)"; break;
              default: message = "Anderer Fehler: " + res.data.cause;
            }
            //server doesn't respond correctly
            message = "Bitte füge Kompetenzen/Unteraufgaben hinzu oder setze Unteraufgaben auf 'bereit'.";

            if($scope.isNewTask) {
              $ionicPopup.show({
                title: "Task wurde erstellt, kann aber nicht auf 'bereit' gesetzt werden.",
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
                title: "Task kann nicht auf 'bereit' gesetzt werden",
                template: message,
                okType: "button-positive button-outline"
              })
            }
          }
          return false;

          $state.go('tabsController.task', { id:taskId }, { location: "replace" }).then(function(res){
            $ionicHistory.removeBackView();
          });
        })
      })
    }

    $scope.readyToPublishTree = function(){
      if($scope.newTask){ return }
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
