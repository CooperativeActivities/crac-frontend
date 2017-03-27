/**
 * Created by P23460 on 25.10.2016.
 */
cracApp.factory('UserDataService', ["$http","$rootScope", function($http,$rootScope){

    var srv = {};
    var CompetenceData = [];


    // URL to REST-Service
    srv._baseURL = "https://core.crac.at/crac-core/";

    // Get all users
    srv.getAllUsers = function(){
      return $http.get(srv._baseURL + "user/all");
    }

    // Get specified user by id (integer)
    srv.getUserById = function(id){
      return $http.get(srv._baseURL + 'user/' + id).then(function(res){ return res.data.object });
    }

    /*
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

    /*
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
  /*
   * Updates the user which is currently logged in and new user data
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
    srv.updateCurrentUser = function(newUserData){
      return $http.put(srv._baseURL + "user", newUserData);
    }


    // Returns the current logged in user
    srv.getCurrentUser = function(){
      return $http.get(srv._baseURL + "user");
    }
    //Returns the competences of the currently logged in user, wrapped in the relationship-object
    srv.getCompRelationships = function(){
     return $http.get(srv._baseURL + 'user/competence');
    }

    srv.createNewCompetence = function(competenceData){
      return $http.post(srv._baseURL + 'admin/competence', competenceData);
    }
    //Returns an array containing all competences
    srv.allCompetences = function(){
      return $http.get(srv._baseURL + 'competence/all');
    }
    //Add a competence with given ID to the currently logged in user, likeValue and proficiencyValue are mandatory
    srv.addLikeProfValue = function(id,likeValue,proficiencyValue){
      return $http.get(srv._baseURL + 'user/competence/'+ id +'/add/'+ likeValue +'/'+ proficiencyValue);
    }
    // Remove a competence with given ID from the currently logged in user
    srv.removeCompetence = function(id){
      return $http.get(srv._baseURL + 'user/competence/'+ id + '/remove');
    }
    //Returns a user object with given id
    srv.getCompetenceById = function(id){
      return $http.get(srv._baseURL + 'competence/'+ id);
    }
    //Adjust the values of a user-competence connection
    srv.updateCompetence = function(id,likeValue,proficiencyValue){
      return $http.get(srv._baseURL + 'user/competence/'+ id +'/adjust/'+ likeValue +'/'+ proficiencyValue);
    }
    //Returns all notifications, which target the logged in user
    srv.getNotification = function(){
      return $http.get(srv._baseURL + 'notification');
    }
    //Show all competences, that are and not yet connected available to a user
    srv.getAllAvailableCompetences = function(){
     return $http.get(srv._baseURL + 'user/competence/available');
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
      updateCurrentUser : function(newUserData){
        return srv.updateCurrentUser(newUserData);
      },
      getCurrentUser : function(){
        return srv.getCurrentUser();
      },
      getCompRelationships : function(){
          return srv.getCompRelationships();
      },
      createNewCompetence : function(competenceData){
        return srv.createNewCompetence(competenceData);
      },
      allCompetences : function(){
        return srv.allCompetences();
      },
      removeCompetence : function(id){
        return srv.removeCompetence(id);
      },
      addLikeProfValue : function(id,likeValue,proficiencyValue){
        return srv.addLikeProfValue(id,likeValue,proficiencyValue);
      },
      setCompetenceData : function(data){
        return srv.setCompetenceData(data);
      },
      getCompetenceData : function(){
        return srv.getCompetenceData();
      },
      getCompetenceById : function(id) {
        return srv.getCompetenceById(id);
      },
      updateCompetence : function(id,likeValue,proficiencyValue){
        return srv.updateCompetence(id,likeValue,proficiencyValue);
      },
      getNotification : function(){
        return srv.getNotification();
      },
      getAllAvailableCompetences : function(){
        return srv.getAllAvailableCompetences();
      }
    }

  }])
