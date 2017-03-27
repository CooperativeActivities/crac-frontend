cracApp.factory('UserDataService', ["Helpers", function(Helpers){

  var srv = {};

  var ajax = Helpers.ajax

  // Get all users
  srv.getAllUsers = function(){
    return ajax("user/all", "get");
  }

  // Get specified user by id (integer)
  srv.getUserById = function(id){
    return ajax("user/" + id, "get");
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
    return ajax("user", "post", { payload: user });
  }

  // Deletes the user with the given id
  srv.deleteUserById = function(id){
    return ajax("user/" + id, "delete");
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
    return ajax("user/" + id, "put", { payload: newUserData });
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
    return ajax("user", "put", { payload: newUserData });
  }

  // Returns the current logged in user
  srv.getCurrentUser = function(){
    return ajax("user/all", "get");
  }
  //Returns the competences of the currently logged in user, wrapped in the relationship-object
  srv.getCompRelationships = function(){
    return ajax("user/competence", "get");
  }

  srv.createNewCompetence = function(competenceData){
    return ajax("admin/competence", "post", { payload: competenceData });
  }
  //Returns an array containing all competences
  srv.allCompetences = function(){
    return ajax("competence/all", "get");
  }
  //Add a competence with given ID to the currently logged in user, likeValue and proficiencyValue are mandatory
  srv.addLikeProfValue = function(id,likeValue,proficiencyValue){
    return ajax("user/competence/" + id + "/add/" + likeValue + "/" + proficiencyValue, "get")
  }
  // Remove a competence with given ID from the currently logged in user
  srv.removeCompetence = function(id){
    return ajax("user/competence/" + id + "/remove", "get")
  }
  //Returns a user object with given id
  srv.getCompetenceById = function(id){
    return ajax("competence/" + id, "get")
  }
  //Adjust the values of a user-competence connection
  srv.updateCompetence = function(id,likeValue,proficiencyValue){
    return ajax("user/competence/" + id + "/adjust/" + likeValue + "/" + proficiencyValue, "get")
  }
  //Returns all notifications, which target the logged in user
  srv.getNotification = function(){
    return ajax("notification", "get");
  }
  //Show all competences, that are and not yet connected available to a user
  srv.getAllAvailableCompetences = function(){
    return ajax("user/competence/available", "get");
  }


  return srv
}])
