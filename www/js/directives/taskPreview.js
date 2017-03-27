cracApp.directive('taskPreview', ["TaskDataService", function(TaskDataService) {
  return {
    scope: {
      task: "=",
			action: "="
    },
    link: function(scope, element, attr){
      scope.isSubtask = scope.task.superTask !== null;

			scope.isSingleTime = scope.task.startTime == scope.task.endTime;
			var startDate = new Date(scope.task.startTime);
			var endDate = new Date(scope.task.endTime);
			scope.isSingleDate =
				(startDate.getDate() == endDate.getDate()) &&
				(startDate.getFullYear() == endDate.getFullYear()) &&
				(startDate.getMonth() == endDate.getMonth());

      // @TODO: get this info from the task
			TaskDataService.getTaskRelatById(scope.task.id).then(function(res){
				return res.data[1].participationType;
			},function(error){
			  console.log("Error: " + error);
				return "NOT_PARTICIPATING";
			}).then(function(relation){
				scope.participationType = relation;
			});

      //initialize to false
      scope.showFollow = false;
      scope.showUnfollow = false;

      scope.follow = function(id){
        //failsafe, so you dont accidentally follow a task you were leading/participating
        if(scope.participationType === "NOT_PARTICIPATING"){
          TaskDataService.changeTaskPartState(id,'follow').then(function(res) {
            console.log("Following task");
            scope.participationType = "FOLLOWING";
          }, function(error) {
            console.log('An error occurred!', error);
          });
        }
      };
      scope.unfollow = function(id) {
        //failsafe, so you dont accidentally cancel leading/participating a task
        if(scope.participationType === "FOLLOWING"){
          TaskDataService.removeOpenTask(id).then(function (res) {
            console.log("No longer participating");
            scope.participationType = "NOT_PARTICIPATING";
          }, function (error) {
            console.log('An error occurred!', error);
          });
        }
      };
      /*scope.updateFlags = function(){
        scope.showFollow = true;
        scope.showUnfollow = false;
      };
      scope.updateFlags();*/
    },
    templateUrl: 'templates/directives/taskPreview.html'
  };
}]);
