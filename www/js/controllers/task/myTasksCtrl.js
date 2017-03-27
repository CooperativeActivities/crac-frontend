/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('myTasksCtrl', ['$scope','$window','$route', '$stateParams','$routeParams','TaskDataService','$state',
  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope,$window, $route, $stateParams, $routeParams, TaskDataService, $state) {

  $scope.completed ="'!' + 'COMPLETED'";
  $scope.doRefresh = function(){
    TaskDataService.getMyTasks().then(function(res) {
		// @TODO: object not structured correctly
		// if( !res || !res.success ) {
		if( !res || !res.data || res.status != 200 ) {
			ErrorDisplayService.showError(
				res,
				"Aufgabe kann nicht geladen werden"
			);
			return;
		}
		
		console.log("My Tasks: ");
		console.log(res);
		$scope.participatingTasks = res.data.participating
		$scope.followingTasks = res.data.following
		$scope.leadingTasks = res.data.leading
		$scope.$broadcast('scroll.refreshComplete');
    }, function(error) {
		ErrorDisplayService.showError(
			error,
			"Aufgabe kann nicht geladen werden"
		);
    })
  }

  $scope.doRefresh();

  $scope.makeNewTask= function(){
    $state.go('tabsController.newTask');
  }

  $scope.loadSingleTask = function(taskId){
    $state.go('tabsController.task', { id:taskId }, {reload:true});
  }
}])
