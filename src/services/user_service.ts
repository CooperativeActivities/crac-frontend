import { Injectable } from '@angular/core';
import { HelperService } from "./helpers";

@Injectable()
export class UserDataService {
  constructor(public helpers: HelperService){ }

  // Get all users
  getAllUsers () {
    return this.helpers.ajax("user/all", "get");
  }

  // Get specified user by id (integer)
  getUserById (id) {
    return this.helpers.ajax("user/" + id, "get");
  }

  // create new user
  createUser (user) {
    return this.helpers.ajax("user", "post", { payload: user });
  }

  // Deletes the user with the given id
  deleteUserById (id) {
    return this.helpers.ajax("user/" + id, "delete");
  }

  // Updates the user with the specified id and new user data
  updateUserById (id, newUserData) {
    return this.helpers.ajax("user/" + id, "put", { payload: newUserData });
  }

  // Updates the user which is currently logged in and new user data
  updateCurrentUser (newUserData) {
    return this.helpers.ajax("user", "put", { payload: newUserData });
  }

  // Returns the current logged in user
  getCurrentUser () {
    return this.helpers.ajax("user", "get");
  }


  createNewCompetence (competenceData) {
    return this.helpers.ajax("admin/competence", "post", { payload: competenceData });
  }
  //Returns an array containing all competences
  allCompetences () {
    return this.helpers.ajax("competence/all", "get");
  }
  //Returns an array containing all competence areas
  getCompetenceAreas () {
    return this.helpers.ajax("competence/area", "get");
  }
  //Returns an array of all competences within an area
  getCompetencesForArea (id) {
    return this.helpers.ajax("competence/area/" + id, "get");
  }
  //Add a competence with given ID to the currently logged in user, likeValue and proficiencyValue are mandatory
  addLikeProfValue (id,likeValue,proficiencyValue) {
    return this.helpers.ajax("competence/" + id + "/add", "post", { payload: {  likeValue: likeValue, proficiencyValue: proficiencyValue } })
  }
  // Remove a competence with given ID from the currently logged in user
  removeCompetence (id) {
    return this.helpers.ajax("competence/" + id + "/remove", "delete")
  }
  //Returns a user object with given id
  getCompetenceById (id) {
    return this.helpers.ajax("competence/" + id, "get")
  }
  //Adjust the values of a user-competence connection
  updateCompetence (id,likeValue,proficiencyValue) {
    return this.helpers.ajax("competence/" + id + "/adjust", "put", { payload: {  likeValue: likeValue, proficiencyValue: proficiencyValue } })
  }
  //Show all competences, that are and not yet connected available to a user
  getAllAvailableCompetences () {
    return this.helpers.ajax("competence/available", "get");
  }


  //Returns all notifications, which target the logged in user
  getNotification () {
    return this.helpers.ajax("notification", "get");
  }
  //Returns all notifications in the system
  getNotificationAll () {
    return this.helpers.ajax("notification/admin", "get");
  }
  // accept given notification
  acceptNotification (notificationId) {
    return this.helpers.ajax("notification/" + notificationId + "/accept", "get");
  }
  // decline given notification
  declineNotification (notificationId) {
    return this.helpers.ajax("notification/" + notificationId + "/deny", "get");
  }



  //get friends of logged in user
  getFriends () {
    return this.helpers.ajax("user/friends", "get");
  }
  // send a friend request notification to specified user
  friendRequest (userId) {
    return this.helpers.ajax("user/" + userId + "/friend", "get");
  }
}
