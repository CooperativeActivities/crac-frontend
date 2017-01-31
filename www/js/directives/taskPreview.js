cracApp.directive('taskPreview', ["TaskDataService", function(TaskDataService) {
  return {
    scope: {
      task: "=",
    },
    link: function(scope, element, attr){
      scope.statusIsPublished = scope.task.taskState === "PUBLISHED"
      scope.statusIsNotPublished = scope.task.taskState === "NOT_PUBLISHED" && !scope.task.readyToPublish
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
