/**
 * Created by P23460 on 25.10.2016.
 */
cracApp.factory('UserDataService', ["$http","$rootScope", function($http,$rootScope){

    var srv = {};

    // URL to REST-Service
    srv._baseURL = "https://core.crac.at/crac-core/";

    // Get all users
    srv.getAllUsers = function(){
      return $http.get(srv._baseURL + "user/all");
    }

    // Get specified user by id (integer)
    srv.getUserById = function(id){
      console.log($rootScope.globals)
      var req = {
        method: 'GET',
        url: srv._baseURL + 'user/' + id,
        headers: {
          'Authorization': "Basic " + $rootScope.globals.currentUser.authdata
        }
      }
      //return $http(req);
      return $http.get(srv._baseURL + 'user/' + id);
    }

    /**
     * Given a user in the following structure
     {
         "name":"test",
         "password": "test",
         "role":"USER",
         "firstName":"TestHans",
         "lastName":"TestName",
         "phone":"234",
         "email":"asd@asd"
         }
     */
    srv.createUser = function(user){
      return $http.post(srv._baseURL + "user", user);
    }

    // Deletes the user with the given id
    srv.deleteUserById = function(id){
      return $http.delete(srv._baseURL + "user/" + id);
    }

    /**
     * Updates the user with the specified id and new user data
     {
         "name":"test",
         "password": "test",
         "role":"USER",
         "firstName":"TestHans",
         "lastName":"TestName",
         "phone":"234",
         "email":"asd@asd"
      }
     */
    srv.updateUserById = function(id, newUserData){
      return $http.put(srv._baseURL + "user/" + id, newUserData);
    }

    // Returns the current logged in user
    srv.getCurrentUser = function(){
      return $http.get(srv._baseURL + "user");
    }

    /**
     * EXPOSE Service Methods
     **/
    return {
      getUserById : function(id){
        return srv.getUserById(id);
      },
      createUser : function(user){
        return srv.createUser(user);
      },
      deleteUserById : function(id){
        return srv.deleteUserById(id);
      },
      updateUserById : function(id, newUserData){
        return srv.updateUserById(id, newUserData);
      },
      getCurrentUser : function(){
        return srv.getCurrentUser();
      }
    }

  }])
