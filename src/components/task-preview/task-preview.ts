import { Component, Input } from '@angular/core';

@Component({
  selector: 'task-preview',
  templateUrl: 'task-preview.html'
})
export class TaskPreviewComponent {
  @Input() task: any
  @Input() action: any
  @Input() showAllIcons: Boolean
  constructor() {}
  isSingleDate () {
    let startDate = new Date(this.task.startTime)
    let endDate = new Date(this.task.endTime)
    return (startDate.getDate() == endDate.getDate()) &&
      (startDate.getFullYear() == endDate.getFullYear()) &&
      (startDate.getMonth() == endDate.getMonth())
  }
  isSingleTime () { return this.task.startTime == this.task.endTime; }

}

  /*cracApp.directive('taskPreview', ['TaskDataService', 'ionicToast', function(TaskDataService, ionicToast) {
  return {
    scope: {
      task: "=",
      action: "=",
      showAllIcons: "=",
    },
    link: function(scope, element, attr){
      scope.isSubtask = scope.task.superTask !== null;

			scope.isSingleTime = scope.task.startTime == scope.task.endTime;
      // @TODO: get this info from the task
      /*
      TaskDataService.getTaskRelatById(scope.task.id).then(function(res){
        return res.meta.relationship.participationType;
      },function(error){
        //@TODO this is not ideal, NOT_PARTICIPATING should be handled in success and this should have a warn
        return "NOT_PARTICIPATING";
      }).then(function(relation){
        scope.participationType = relation;
      });
      */

/*
      //initialize to false
      scope.showFollow = false;
      scope.showUnfollow = false;

      scope.follow = function(id){
        //failsafe, so you dont accidentally follow a task you were leading/participating
        //if(scope.participationType === "NOT_PARTICIPATING"){
          TaskDataService.changeTaskPartState(id,'follow').then(function(res) {
            console.log("Following task");
            //scope.participationType = "FOLLOWING";
          }, function(error) {
            ionicToast.show("Aufgabe kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
          });
        //}
      };
      scope.unfollow = function(id) {
        //failsafe, so you dont accidentally cancel leading/participating a task
        //if(scope.participationType === "FOLLOWING"){
          TaskDataService.removeOpenTask(id).then(function (res) {
            console.log("No longer participating");
            //scope.participationType = "NOT_PARTICIPATING";
          }, function (error) {
            ionicToast.show("Aufgabe kann nicht abgesagt werden: " + error.message, 'top', false, 5000);
          });
        //}
      };
    },
    templateUrl: 'directives/taskPreview/taskPreview.html'
  };
}]);
 */
