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
      }
    }

  }])
