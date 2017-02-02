cracApp.directive('taskPreview', ["TaskDataService", function(TaskDataService) {
  return {
    scope: {
      task: "=",
    },
    link: function(scope, element, attr){
      scope.statusNotPublished = scope.task.taskState === "NOT_PUBLISHED"
      scope.statusPublished = scope.task.taskState === "PUBLISHED"
      scope.statusStarted = scope.task.taskState === "STARTED"
      scope.statusCompleted = scope.task.taskState === "COMPLETED"
      scope.isSubtask = scope.task.superTask !== null;

      scope.follow = function(id){
        TaskDataService.changeTaskPartState(id,'follow').then(function(res) {
          console.log("following task", res.data)
        }, function(error) {
          console.log('An error occurred!', error);
        });
      };
    },
    templateUrl: 'templates/directives/taskPreview.html'
  };
}]);
