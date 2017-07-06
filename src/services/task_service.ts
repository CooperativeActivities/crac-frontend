import { Injectable } from '@angular/core';
import { HelperService } from "./helpers";

@Injectable()
export class TaskDataService {
  constructor(public helpers: HelperService){ }
  // Get all task
  getAllParentTasks(){
    return this.helpers.ajax("task/parents", "get", { handleSpecificErrors: function(response, responseData){
      // switch .data.cause here
      throw { error: responseData, message: "Aufgabenliste konnte nicht geladen werden" };
    }});
  };
  //Get a TAsk by ID
  getTaskById(id){
    return this.helpers.ajax("task/" + id, "get");
  };
  //Update the Task data if there are changes
  updateTaskById(taskData, id){
    return this.helpers.ajax("task/" + id, "put", { payload: taskData });
  };
  //Adds target task to the open-tasks of the logged-in user or changes it's state; Choose either 'participate', 'follow', or 'lead'
  changeTaskPartState(id, stateName){
    return this.helpers.ajax("task/" + id + "/add/" + stateName, "put");
  };


  //Returns all tasks of logged in user, divided in the TaskParticipationTypes
  getMyTasks(){
    return this.helpers.ajax("task/type", "get");
  };
  //Creates a new task
  createNewTask(taskData){
    return this.helpers.ajax("admin/task", "post", { payload: taskData });
  };
  //Removes the task with given id from the open-tasks of the currently logged in user
  removeOpenTask(id){
    return this.helpers.ajax("task/" + id + "/remove", "delete");
  };
  /*
  //Returns target task and its relationship to the logged in user
  getTaskRelatById(id){
    return this.helpers.ajax("user/task/" + id, "get");
  }
  */
  //Returns a sorted list of elements with the best fitting tasks for the logged in user
  getMatchingTasks(number=0){
    if(number) return this.helpers.ajax("task/find/" + number, "get");
    else return this.helpers.ajax("task/find", "get");
  };
  //Sets a single task ready to be published, only works if it's children are ready
  setReadyToPublishS(taskId){
    return this.helpers.ajax("task/" + taskId + "/publish/ready/single", "get");
  };
  //Sets target task and all children ready to be published
  setReadyToPublishT(taskId){
    return this.helpers.ajax("task/" + taskId + "/publish/ready/tree", "get");
  };
  //Sets the relation between the logged in user and target task to done, meaning the user completed the task
  setTaskDone(taskId, done_boolean){
    return this.helpers.ajax("task/" + taskId + "/done/"+done_boolean, "put");
  };
  /*
   **Change the state of target task; Choose either 'publish', 'start', or 'complete'**
   *For each state different prerequisite have to be fullfilled:*
   *NOT_PUBLISHED: Default state*
   *PUBLISHED: Only allowed when the task-fields are all filled*
   *STARTED: Only allowed when the parent task is started and if sequential, the previous task is completed*
   *COMPLETED: A task can only be completed when its children are all completed or if it has none*
   */
  changeTaskState(taskId, state_name){
    return this.helpers.ajax("task/" + taskId + "/state/" + state_name, "put");
  };
  //Deletes the task with given id
  deleteTaskById(taskId){
    return this.helpers.ajax("admin/task/" + taskId, "delete");
  };
  //Creates a task, that is set as the child of the chosen existing task
  createNewSubTask(taskData, taskId){
    return this.helpers.ajax("task/" + taskId + "/extend", "post", { payload: taskData });
  };
  //Adds target competence to target task, it is mandatory to add the proficiency and importanceLvl
  addCompetenceToTask(taskId,competenceId,proficiency,importance,mandatory){
    return this.helpers.ajax("task/" + taskId + "/competence/" + competenceId + "/require/" + proficiency + "/" + importance+ "/" + mandatory, "get");
  };
  //removes target competence from target task
  removeCompetenceFromTask(taskId,competenceId){
    return this.helpers.ajax("task/" + taskId + "/competence/" + competenceId + "/remove", "delete");
  };
  //Adds array of competence objects
  addCompetencesToTask(taskId, competences){
    return this.helpers.ajax("task/" + taskId + "/competence/require", "post", { payload: competences });
  };
  //Overrides task's competences with array of competence objects
  setCompetencesTask(taskId, competences){
    return this.helpers.ajax("task/" + taskId + "/competence/overwrite", "put", { payload: competences });
  };
  //Overrides single task competence
  updateTaskCompetence(taskId, competence){
    return this.helpers.ajax("task/" + taskId + "/competence/" + competence.id + "/adjust", "put", { payload: competence });
  };
  //Get all Competences which are not added to that specific task
  getAllAvailableCompetences(taskId){
    return this.helpers.ajax("task/" + taskId + "/competence/available", "get");
  };
  //Get all competences
  getAllCompetences(){
    return this.helpers.ajax("/competence/all", "get");
  };

  //Add new comment to a task
  addComment(taskId, commentData){
    return this.helpers.ajax("task/" + taskId + "/comment/add", "post", { payload: commentData });
  };
  //Remove a comment from a task
  removeComment(taskId, commentId){
    return this.helpers.ajax("task/" + taskId + "/comment/" + commentId + "/remove", "delete");
  };
  //Get all comments for a task
  getAllCommentsForTask(taskId){
    return this.helpers.ajax("task/" + taskId + "/comments", "get");
  };

  //Adds target material to target task
  addMaterialToTask(taskId,material){
    return this.helpers.ajax("task/" + taskId + "/material/add", "post", { payload: material });
  };
  removeMaterialFromTask(taskId,materialId){
    return this.helpers.ajax("task/" + taskId + "/material/" + materialId + "/remove", "delete");
  };
  //Adds array of material objects
  addMaterialsToTask(taskId, materials){
    return this.helpers.ajax("task/" + taskId + "/material/multiple/add", "post", { payload: materials });
  };
  //Overrides task's materials with array of material objects
  setMaterialsTask(taskId, materials){
    return this.helpers.ajax("task/" + taskId + "/material/multiple/overwrite", "post", { payload: materials });
  };

  //Current user subscribes to material with quantity (if already subscribed, change quantity)
  subscribeToMaterial(taskId, materialId, quantity){
    return this.helpers.ajax("task/" + taskId + "/material/" + materialId + "/subscribe/" + quantity, "put");
  };
  //Current user unsubscribes from material
  unsubscribeFromMaterial(taskId, materialId){
    return this.helpers.ajax("task/" + taskId + "/material/" + materialId + "/unsubscribe", "delete");
  };

  //returns the completed tasks for the current user by participation type (LEADING, PARTICIPATING, FOLLOWING)
  getCompletedTasks(participationType){
    return this.helpers.ajax(" /task/completed/" + participationType, "get");
  };

  //returns all evaluations for the current user
  getTasksToEvaluate(){
    return this.helpers.ajax(" /evaluation", "get");
  };

  getTasksToEvaluateById(evaluationId){
    return this.helpers.ajax(" /evaluation/"+evaluationId, "get");
  };







};
