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

  // create new user
  srv.createUser = function(user){
    return ajax("user", "post", { payload: user });
  }

  // Deletes the user with the given id
  srv.deleteUserById = function(id){
    return ajax("user/" + id, "delete");
  }

  // Updates the user with the specified id and new user data
  srv.updateUserById = function(id, newUserData){
    return ajax("user/" + id, "put", { payload: newUserData });
  }

  // Updates the user which is currently logged in and new user data
  srv.updateCurrentUser = function(newUserData){
    return ajax("user", "put", { payload: newUserData });
  }

  // Returns the current logged in user
  srv.getCurrentUser = function(){
    return ajax("user/all", "get");
  }


  //Returns the competences of the currently logged in user, wrapped in the relationship-object
  srv.getCompRelationships = function(){
    return ajax("competence", "get");
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
    return ajax("competence/" + id + "/add", "post", { payload: {  likeValue: likeValue, proficiencyValue: proficiencyValue } })
  }
  // Remove a competence with given ID from the currently logged in user
  srv.removeCompetence = function(id){
    return ajax("competence/" + id + "/remove", "delete")
  }
  //Returns a user object with given id
  srv.getCompetenceById = function(id){
    return ajax("competence/" + id, "get")
  }
  //Adjust the values of a user-competence connection
  srv.updateCompetence = function(id,likeValue,proficiencyValue){
    return ajax("competence/" + id + "/adjust", "put", { payload: {  likeValue: likeValue, proficiencyValue: proficiencyValue } })
  }
  //Show all competences, that are and not yet connected available to a user
  srv.getAllAvailableCompetences = function(){
    return ajax("competence/available", "get");
  }


  //Returns all notifications, which target the logged in user
  srv.getNotification = function(){
    return ajax("notification", "get");
  }
  //Returns all notifications in the system
  srv.getNotificationAll = function(){
    return ajax("notification/admin", "get");
  }
  // accept given notification
  srv.acceptNotification = function(notificationId){
    return ajax("notification/" + notificationId + "/accept", "get");
  }
  // decline given notification
  srv.declineNotification = function(notificationId){
    return ajax("notification/" + notificationId + "/deny", "get");
  }



  //get friends of logged in user
  srv.getFriends = function(){
    return ajax("user/friends", "get");
  }
  // send a friend request notification to specified user
  srv.friendRequest = function(userId){
    return ajax("user/" + userId + "/friend", "get");
  }

  return srv
}])
