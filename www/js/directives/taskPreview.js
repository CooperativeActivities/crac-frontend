cracApp.directive('taskPreview', [function() {
  return {
    scope: {
      task: "=",
    },
    link: function(scope, element, attr){
      scope.statusIsPublished = scope.task.taskState === "PUBLISHED"
      scope.statusIsNotPublished = scope.task.taskState === "NOT_PUBLISHED" && !scope.task.readyToPublish
      scope.isSubtask = scope.task.superTask !== null;
      console.log(scope)
    },
    templateUrl: 'templates/directives/taskPreview.html'
  };
}]);
