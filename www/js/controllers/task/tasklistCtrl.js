/**
 * Created by P41332 on 25.10.2016.
 */

cracApp.controller('tasklistCtrl', function ($rootScope, $state, $scope, $http, $ionicModal, TaskDataService, $q) {

  $scope.loadSingleTask = function(taskId){
    $state.go('tabsController.task', { id:taskId }, {reload:true});
  }

  $scope.doRefresh = function(){
    $q.all(
      TaskDataService.getMatchingTasks(3).then(function(res){
        // @TODO: object not structured correctly
        // if( !res || !res.success ) {
        if( !res || !res.data || res.status != 200 ) {
          console.warn("Matching tasks could not be retrieved", res);
        }

            $scope.matchingTasks = res.data;
        console.log("Matching tasks: ");
        console.log(res.data);
          }, function(error){
        console.warn("Matching tasks could not be retrieved", error);
        }),
          TaskDataService.getAllParentTasks().then(function (res) {
        // @TODO: object not structured correctly
        // if( !res || !res.success ) {
        if( !res || !res.data || res.status != 200 ) {
          console.warn("All task list could not be retrieved", res);
        }
           $scope.parentTasks = res.data;
        console.log("Matching tasks: ");
        console.log(res.data);
          }, function (error) {
        console.warn("All task list could not be retrieved", res);
        })
      ).then(function(res){
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  $scope.doRefresh();

  /*----------------------------------------------------------------------------------------------------------------- */
  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };


  /*
   * if the task has a childTask, return true
   * else return false;
   */

  $scope.checkChildTask = function(task){
    if(task.length > 0){
      return true;
    }
    return false;
  }

})


