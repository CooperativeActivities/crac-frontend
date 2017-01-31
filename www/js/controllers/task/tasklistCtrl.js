/**
 * Created by P41332 on 25.10.2016.
 */

cracApp.controller('tasklistCtrl', function ($rootScope, $state, $scope, $http, $ionicModal, TaskDataService, $q) {

  $scope.loadSingleTask = function(taskId){
    $state.go('tabsController.task1', { id:taskId });
  }
  $scope.doRefresh = function(){
    $q.all(
      TaskDataService.getMatchingTasks(3).then(function(res){
        $scope.matchingTasks = res.data
      }, function(error){ console.log('An error occurred!', error) }),
      TaskDataService.getAllParentTasks().then(function (res) {
        $scope.parentTasks = res.data;
      }, function (error) { console.log('An error occurred!', error) })
    ).then(function(res){
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  $scope.doRefresh();


})


