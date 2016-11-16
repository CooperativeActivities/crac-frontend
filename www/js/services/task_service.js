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
     return $http.put(srv._baseURL + "admin/task/" + id, taskData);
    }
    srv.changeTaskState = function(id, stateName){
       return $http.get(srv._baseURL + "task/" + id + "/" + stateName);
    }
    srv.getMyTasks = function(){
     return $http.get(srv._baseURL + "user/task");
    }
    srv.createNewTask= function(taskData){
      return $http.post(srv._baseURL + "task", taskData);
    }
    srv.removeOpenTask= function(id){
      return $http.get(srv._baseURL + "user/task/" + id + "/remove");
    }
    srv.getTaskRelatById = function(id){
      return $http.get(srv._baseURL + "user/task/" + id);
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
      changeTaskState : function(id, stateName){
        return srv.changeTaskState(id, stateName);
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
      }
    }


  }])
