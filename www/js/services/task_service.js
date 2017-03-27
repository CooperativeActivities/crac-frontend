cracApp.factory('TaskDataService', ["$http","$rootScope", function($http,$rootScope){

  var srv = {};

  // URL to REST-Service
  srv._baseURL = "https://core.crac.at/crac-core/";
  function throwIfErrors (response){
    if(response.data.success){ return response.data; }
    else {
      // switch error.data.cause here
      throw { error: response.data, message: "Nicht gefunden oder so" };
    }
  }

  function ajax(url, method, handleSpecificErrors, payload){
    if(!handleSpecificErrors || !(handleSpecificErrors instanceof Function)){
      handleSpecificErrors = function(){}
    }
    return $http[method](srv._baseURL + url, payload)
      .then(function(response){
        if(response && response.data && response.data.success){ return response.data; }
        else {
          // handle specific errors first since we might want to have a special message for 404, for example
          handleSpecificErrors(response)
          //handle common errors (fallbacks)
          if(response.status === 401){
            throw { error: response.data, message: "Sie sind nicht eingeloggt." };
          }
          if(response.status === 404){
            throw { error: response.data, message: "Resource nicht gefunden" };
          }
          throw { error: response.data, message: "Anderer Fehler" };
        }
      }, function noConnectionError(error){
        throw { error: error, message: "Keine Verbindung" };
      });
  }

  // Get all task
  srv.getAllParentTasks = function(){
    return ajax("task/parents", "get", function(response){
      // switch .data.cause here
      throw { error: response.data, message: "Aufgabenliste konnte nicht geladen werden" };
    })
  }
  //Get a TAsk by ID
  srv.getTaskById = function(id){
    return ajax("task/" + id, "get", function(response){
      // switch .data.cause here
      //throw { error: response.data, message: "Task #" + id + " konnte nicht geladen werden" };
    })
  }
  //Update the Task data if there are changes
  srv.updateTaskById = function(taskData, id){
    return ajax("task/" + id, "put", function(response){
      // switch .data.cause here
      //throw { error: response.data, message: "Task #" + id + " konnte nicht gespeichert werden" };
    })
  }
  //Adds target task to the open-tasks of the logged-in user or changes it's state; Choose either 'participate', 'follow', or 'lead'
  srv.changeTaskPartState = function(id, stateName){
    return ajax("user/task/" + id + "/" + stateName, "get", function(response){
      // switch .data.cause here
      //throw { error: response.data, message: "Task #" + id + " konnte nicht verändert werden" };
    })
  }
  //Returns all tasks of logged in user, divided in the TaskParticipationTypes
  srv.getMyTasks = function(){
    return ajax("user/task", "get", function(response){
      // switch .data.cause here
      //throw { error: response.data, message: "Task #" + id + " konnte nicht gespeichert werden" };
    })
  }
  //Creates a new task
  srv.createNewTask= function(taskData){
    return ajax("admin/task", "post", function(response){}, taskData);
  }
  //Removes the task with given id from the open-tasks of the currently logged in user
  srv.removeOpenTask= function(id){
    return ajax("user/task/" + id + "/remove", "get", function(response){});
  }
  //Returns target task and its relationship to the logged in user
  srv.getTaskRelatById = function(id){
    return ajax("user/task/" + id, "get", function(response){});
  }
  //Returns a sorted list of elements with the best fitting tasks for the logged in user
  srv.getMatchingTasks = function(number){
    if(number) return ajax("user/findMatchingTasks/" + number, "get");
    else return ajax("user/findMatchingTasks", "get")
  }
  //Sets a single task ready to be published, only works if it's children are ready
  srv.setReadyToPublishS = function(taskId){
    return ajax("task/" + taskId + "/publish/ready/single", "get")
  }
  //Sets target task and all children ready to be published
  srv.setReadyToPublishT = function(taskId){
    return ajax("task/" + taskId + "/publish/ready/tree", "get")
  }
  //Sets the relation between the logged in user and target task to done, meaning the user completed the task
  srv.setTaskDone = function(taskId, done_boolean){
    return ajax("task/" + taskId + "/done", "get")
  }
  /*
   **Change the state of target task; Choose either 'publish', 'start', or 'complete'**
   *For each state different prerequisite have to be fullfilled:*
   *NOT_PUBLISHED: Default state*
   *PUBLISHED: Only allowed when the task-fields are all filled*
   *STARTED: Only allowed when the parent task is started and if sequential, the previous task is completed*
   *COMPLETED: A task can only be completed when its children are all completed or if it has none*
   */
  srv.changeTaskState = function(taskId, state_name){
    return $http.get(srv._baseURL + "task/" + taskId + "/state/" + state_name).then(throwIfErrors);
  }
  //Deletes the task with given id
  srv.deleteTaskById = function(taskId){
    return $http.delete(srv._baseURL + "admin/task/" + taskId).then(throwIfErrors);
  }
  //Creates a task, that is set as the child of the chosen existing task
  srv.createNewSubTask= function(taskData, taskId){
    return $http.post(srv._baseURL + "task/" + taskId + "/extend", taskData).then(throwIfErrors);
  }
  //Adds target competence to target task, it is mandatory to add the proficiency and importanceLvl
  srv.addCompetenceToTask = function(taskId,competenceId,proficiency,importance,mandatory){
    return $http.get(srv._baseURL + "task/" + taskId + "/competence/" + competenceId + "/require/" + proficiency + "/" + importance+ "/" + mandatory).then(throwIfErrors);
  }
  //removes target competence from target task
  srv.removeCompetenceFromTask = function(taskId,competenceId){
    return $http.get(srv._baseURL + "task/" + taskId + "/competence/" + competenceId + "/remove").then(throwIfErrors);
  }
  //Adds array of competence objects
  srv.addCompetencesToTask = function(taskId, competences){
    return $http.post(srv._baseURL + "task/" + taskId + "/competence/require", competences).then(throwIfErrors);
  }
  //Overrides task's competences with array of competence objects
  srv.setCompetencesTask = function(taskId, competences){
    return $http.put(srv._baseURL + "task/" + taskId + "/competence/overwrite", competences).then(throwIfErrors);
  }
  //Get all Competences which are not added to that specific task
  srv.getAllAvailableCompetences = function(taskId){
    return $http.get(srv._baseURL + 'task/' + taskId + '/competence/available').then(throwIfErrors);
  }
  //Get all competences
  srv.getAllCompetences = function(){
    return $http.get(srv._baseURL + '/competence/all').then(throwIfErrors);
  }

  //Add new comment to a task
  srv.addComment = function(taskId, commentData){
    return $http.post(srv._baseURL + 'task/' + taskId + '/comment/add', commentData).then(throwIfErrors);
  }
  //Remove a comment from a task
  srv.removeComment = function(taskId, commentId){
    return $http.delete(srv._baseURL + 'task/' + taskId + '/comment/' + commentId + '/remove').then(throwIfErrors);
  }
  //Get all comments for a task
  srv.getAllCommentsForTask = function(taskId){
    return $http.get(srv._baseURL + 'task/' + taskId + '/comments').then(throwIfErrors);
  }

  //Adds target material to target task
  srv.addMaterialToTask = function(taskId,material){
    return $http.post(srv._baseURL + "task/" + taskId + "/material/add", material).then(throwIfErrors);
  }
  srv.removeMaterialFromTask = function(taskId,materialId){
    return $http.get(srv._baseURL + "task/" + taskId + "/material/" + materialId + "/remove").then(throwIfErrors);
  }
  //Adds array of material objects
  srv.addMaterialsToTask = function(taskId, materials){
    return $http.post(srv._baseURL + "task/" + taskId + "/material/multiple/add", materials).then(throwIfErrors);
  }
  //Overrides task's materials with array of material objects
  srv.setMaterialsTask = function(taskId, materials){
    return $http.post(srv._baseURL + "task/" + taskId + "/material/multiple/overwrite", materials).then(throwIfErrors);
  }

  //Current user subscribes to material with quantity (if already subscribed, change quantity)
  srv.subscribeToMaterial = function(taskId, materialId, quantity){
    return $http.get(srv._baseURL + "task/" + taskId + "/material/" + materialId + "/subscribe/" + quantity).then(throwIfErrors);
  }
  //Current user unsubscribes from material
  srv.unsubscribeFromMaterial = function(taskId, materialId){
    return $http.get(srv._baseURL + "task/" + taskId + "/material/" + materialId + "/unsubscribe").then(throwIfErrors);
  }

  return srv
}])
