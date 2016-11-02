cracApp.factory('TaskDataService', ["$http","$rootScope", function($http,$rootScope){

    var srv = {};

    // URL to REST-Service
    srv._baseURL = "https://core.crac.at/crac-core/";

    // Get all task
    srv.getAllTasks = function(){
      return $http.get(srv._baseURL + "task");
    }

    /**
     * EXPOSE Service Methods
     **/
    return {
      getAllTasks : function(){
        return srv.getAllTasks();
      }
    }

  }])
