/**
 * Created by x-net on 14.11.2016.
 */
cracApp.controller('addCompetenceCtrl', function($rootScope,$scope, $http, $ionicModal,UserDataService, $state) {

  UserDataService.allCompetences().then(function(res){
    $scope.competences = res.data;
    console.log($scope.competences);
  }, function(error) {
    console.log('An error occurred!', error);
  });

  $scope.addCompetenceInfo = function(indx){
    $state.go('tabsController.addCompetenceInfo', { index:indx });
  };

  $scope.clearSearch = function() {
    $scope.search = '';
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };
  })
