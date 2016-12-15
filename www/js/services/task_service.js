cracApp.factory('TaskDataService', ["$http","$rootScope", function($http,$rootScope){

    var srv = {};

    // URL to REST-Service
    srv._baseURL = "https://core.crac.at/crac-core/";

    // Get all task
    srv.getAllParentTasks = function(){
      return $http.get(srv._baseURL + "task/parents");
    }

    srv.getTaskById = function(id){
      return $http.get(srv._baseURL + "task/" + id);
    }
    srv.updateTaskById = function(taskData, id){
     return $http.put(srv._baseURL + "task/" + id, taskData);
    }
    srv.changeTaskPartState = function(id, stateName){
       return $http.get(srv._baseURL + "user/task/" + id + "/" + stateName);
    }
    srv.getMyTasks = function(){
     return $http.get(srv._baseURL + "user/task");
    }
    srv.createNewTask= function(taskData){
      return $http.post(srv._baseURL + "admin/task", taskData);
    }
    srv.removeOpenTask= function(id){
      return $http.get(srv._baseURL + "user/task/" + id + "/remove");
    }
    srv.getTaskRelatById = function(id){
      return $http.get(srv._baseURL + "user/task/" + id);
    }
    srv.getMatchingTasks = function(){
      return $http.get(srv._baseURL + "user/findMatchingTasks");
    }
    srv.setReadyToPublishS = function(taskId){
      return $http.get(srv._baseURL + "task/" + taskId + "/publish/ready/single");
    }
    srv.setReadyToPublishT = function(taskId){
     return $http.get(srv._baseURL + "task/" + taskId + "/publish/ready/tree");
    }
    srv.setTaskDone = function(taskId, done_boolean){
      return $http.get(srv._baseURL + "task/" + taskId + "/done/" + done_boolean);
    }
    srv.changeTaskState = function(taskId, state_name){
     return $http.get(srv._baseURL + "task/" + taskId + "/state/" + state_name);
    }
    srv.deleteTaskById = function(taskId){
      return $http.delete(srv._baseURL + "admin/task/" + taskId);
    }
    srv.createNewSubTask= function(taskData, taskId){
      return $http.post(srv._baseURL + "task/" + taskId + "/extend", taskData);
    }

    /**
     * EXPOSE Service Methods
     **/
    return {
      getAllParentTasks : function(){
        return srv.getAllParentTasks();
      },
      getTaskById : function(id){
        return srv.getTaskById(id);
      },
      updateTaskById : function(taskData, id){
        return srv.updateTaskById(taskData, id);
      },
      changeTaskPartState : function(id, stateName){
        return srv.changeTaskPartState(id, stateName);
      },
      getMyTasks : function(){
        return srv.getMyTasks();
      },
      createNewTask : function(taskData){
        return srv.createNewTask(taskData);
      },
      removeOpenTask : function(id){
        return srv.removeOpenTask(id);
      },
      getTaskRelatById : function(id){
        return srv.getTaskRelatById(id);
      },
      getMatchingTasks : function() {
        return srv.getMatchingTasks();
      },
      setReadyToPublishS : function(taskId) {
        return srv.setReadyToPublishS(taskId);
      },
      setReadyToPublishT : function(taskId) {
        return srv.setReadyToPublishT(taskId);
      },
      setTaskDone : function(taskId, done_boolean) {
        return srv.setTaskDone(taskId, done_boolean);
      },
      changeTaskState : function(taskId, state_name) {
        return srv.changeTaskState(taskId, state_name);
      },
      deleteTaskById : function(taskId){
        return srv.deleteTaskById(taskId);
      },
      createNewSubTask : function(taskData, taskId){
        return srv.createNewSubTask(taskData, taskId);
      }
    }


  }])
