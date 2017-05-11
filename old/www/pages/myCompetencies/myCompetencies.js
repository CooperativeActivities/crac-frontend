/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('myCompetenciesCtrl', ['$rootScope','$scope','UserDataService','ionicToast','$state',
  function($rootScope,$scope,UserDataService, ionicToast, $state) {
 // console.log("Userid: " +$rootScope.globals.currentUser.id)
  UserDataService.getUserById($rootScope.globals.currentUser.id).then(function(res) {
    $scope.user = res.object;
    console.log($scope.user);
  }, function(error) {
    ionicToast.show("Benutzerinformation kann nicht geladen werden: " + error.message, 'top', false, 5000);
  });

  UserDataService.getCompRelationships().then(function(res){
    $scope.competences = res.object;
    console.log($scope.competences);
  }, function(error) {
    //@TODO error shows when user has no competences, should come as success
  });

  $scope.competenceInfo = function(indx){
    $state.go('tabsController.myCompetenciesInfo', { index:indx });
  };
  $scope.createNewCompetence = function(){
    $state.go('tabsController.newCompetence');
  };

  $scope.addCompetence = function(){
    $state.go('tabsController.addCompetence');
  };

  $scope.remove = function(id){
    UserDataService.removeCompetence(id).then(function(res){
      UserDataService.getCompRelationships().then(function(res){
        $scope.competences = res.object;
        console.log($scope.competences);
      }, function(error) {
        //@TODO error shows when user has no competences, should come as success
      });
    }, function(error) {
      ionicToast.show("Kompetenz kann nicht gelöscht werden: " + error.message, 'top', false, 5000);
    });
  }
}]);
