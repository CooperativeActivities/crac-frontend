/**
 * Created by x-net on 21.12.2016.
 */
cracApp.controller('addCompetenceToTaskInfoCtrl', ['$rootScope','$scope','$window', '$stateParams','$routeParams','UserDataService','TaskDataService','$http', '$ionicModal','$state',
  function($rootScope, $scope, $window, $stateParams, $routeParams, UserDataService,TaskDataService , $http, $ionicModal, $state) {
    console.log($stateParams.compId);
    console.log($stateParams.taskId);
    $scope.comp = [];
    UserDataService.getCompetenceById($stateParams.compId).then(function (res) {
      $scope.competenceInfo= res.data;
      $scope.comp.importance = 50;
      $scope.comp.proficiencyValue = 50;
      $scope.comp.mandatory= false;
      console.log($scope.competenceInfo);
    }, function (error) {
      console.log('An error occurred!', error);
    });




    $scope.add = function(){
      TaskDataService.addCompetenceToTask($stateParams.taskId,$stateParams.compId,$scope.comp.proficiencyValue, $scope.comp.importance, $scope.comp.mandatory).then(function(res){
        console.log(res.data);
        console.log($scope.comp.importance);
        console.log($scope.comp.proficiencyValue);
        console.log($scope.comp.mandatory);
        //$window.location.reload();
        $state.go('tabsController.task1',{id:$stateParams.taskId});
      }, function(error) {
        console.log('An error occurred!', error);
      });
    }

  }]);
