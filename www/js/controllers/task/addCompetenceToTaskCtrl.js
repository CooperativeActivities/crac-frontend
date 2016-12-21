/**
 * Created by x-net on 21.12.2016.
 */
cracApp.controller('addCompetenceToTaskCtrl', function($rootScope,$scope, $http, $ionicModal,TaskDataService, $state, $stateParams) {

  TaskDataService.getAllAvailableCompetences($stateParams.id).then(function(res){
    $scope.competences = res.data;
    console.log($scope.competences);
    console.log(res);
  }), function(error){
    console.log('An error occurred!', error);
    alert(error.data.cause);
  }

  $scope.addCompetenceInfo = function(compId){
    $state.go('tabsController.addCompetenceToTaskInfo', { compId:compId , taskId:$stateParams.id});
  };

  $scope.clearSearch = function() {
    $scope.search = '';
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };

  })
