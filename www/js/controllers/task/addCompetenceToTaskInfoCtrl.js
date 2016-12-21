/**
 * Created by x-net on 21.12.2016.
 */
cracApp.controller('addCompetenceToTaskInfoCtrl', ['$rootScope','$scope','$window', '$stateParams','$routeParams','UserDataService','TaskDataService','$http', '$ionicModal','$state',
  function($rootScope, $scope, $window, $stateParams, $routeParams, UserDataService,TaskDataService , $http, $ionicModal, $state) {
    console.log($stateParams.compId);
    console.log($stateParams.taskId);
    UserDataService.getCompetenceById($stateParams.compId).then(function (res) {
      $scope.competenceInfo= res.data;
      $scope.importance = 50;
      $scope.proficiencyValue = 50;
      console.log($scope.competenceInfo);
    }, function (error) {
      console.log('An error occurred!', error);
    });




    $scope.add = function(){
      TaskDataService.addCompetenceToTask($stateParams.taskId,$stateParams.compId,$scope.proficiencyValue, $scope.importance).then(function(){
        console.log($scope.competenceInfo);
        //$window.location.reload();
        $state.go('tabsController.task1',{id:$stateParams.taskId});
      }, function(error) {
        console.log('An error occurred!', error);
      });
    }

  }]);
