/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('myCompetenciesCtrl', function($rootScope,$scope,$window,$route, $http, $ionicModal,UserDataService, $state) {
  console.log("Userid: " +$rootScope.globals.currentUser.id)
  UserDataService.getUserById($rootScope.globals.currentUser.id).then(function(res) {
    $scope.user = res.data;
    console.log($scope.user);
  }, function(error) {
    console.log('An error occurred!', error);
  });
  UserDataService.getCompRelationships().then(function(res){
    $scope.competences = res.data;
    console.log($scope.competences);
  }, function(error) {
    console.log('An error occurred!', error);
  });

  $scope.competenceInfo = function(indx){
    $state.go('tabsController.myCompetenciesInfo', { index:indx });
  }
  $scope.createNewCompetence = function(){
    $state.go('tabsController.newCompetence');
  }

  $scope.addCompetence = function(){
    $state.go('tabsController.addCompetence');
  }
  $scope.remove = function(id){
    UserDataService.removeCompetence(id).then(function(res){
      $window.location.reload();
      
    }, function(error) {
      console.log('An error occurred!', error);
    });
  }
  })
