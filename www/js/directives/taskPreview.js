cracApp.directive('taskPreview', ["TaskDataService", function(TaskDataService) {
  return {
    scope: {
      task: "=",
    },
    link: function(scope, element, attr){
      scope.statusNotPublished = scope.task.taskState === "NOT_PUBLISHED";
      scope.statusPublished = scope.task.taskState === "PUBLISHED";
      scope.statusStarted = scope.task.taskState === "STARTED";
      scope.statusCompleted = scope.task.taskState === "COMPLETED";
      scope.isSubtask = scope.task.superTask !== null;
      // @TODO: get this info from the task
      scope.participationType = "NOT_PARTICIPATING";

      //initialize to false
      scope.showFollow = false;
      scope.showUnfollow = false;

      scope.follow = function(id){
        //failsafe, so you dont accidentally follow a task you were leading/participating
        if(scope.participationType === "NOT_PARTICIPATING"){
          TaskDataService.changeTaskPartState(id,'follow').then(function(res) {
            scope.participationType = "FOLLOWING";
            scope.updateFlags();
          }, function(error) {
            console.log('An error occurred!', error);
          });
        }
      };
      scope.unfollow = function() {
        //failsafe, so you dont accidentally cancel leading/participating a task
        if(scope.participationType === "FOLLOWING"){
          TaskDataService.removeOpenTask($scope.task.id).then(function (res) {
            scope.participationType = "NOT_PARTICIPATING";
            scope.updateFlags();
          }, function (error) {
            console.log('An error occurred!', error);
            alert(error.data.cause);
          });
        }
      };
      scope.updateFlags = function(){
        scope.showFollow = true;
        scope.showUnfollow = false;
      };
      scope.updateFlags();
    },
    templateUrl: 'templates/directives/taskPreview.html'
  };
}]);
