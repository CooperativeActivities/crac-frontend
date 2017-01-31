/**
 * Created by P41332 on 25.10.2016.
 */

/*
 cracApp.controller('allTasksCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
 // You can include any angular dependencies as parameters for this function
 // TIP: Access Route Parameters for your page via $stateParams.parameterName
 function ($scope, $stateParams) {


 }])
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

  /*
  $scope.getTaskById= function(id){
    TaskDataService.getTaskById(id).then(function (res) {
      $scope.tasks = res.data;
      console.log("scope.task = " + $scope.tasks);
      $scope.singleTask = res;
    }, function (error) {
      console.log('An error occurred!', error);
    });
  };
  */
  $scope.follow = function(id){
    TaskDataService.changeTaskPartState(id,'follow').then(function(res) {
      console.log("following task", res.data)
    }, function(error) {
      console.log('An error occurred!', error);
    });
  };

  $scope.clearSearch = function() {
    $scope.search = '';
  };


})


