/**
 * Created by x-net on 09.11.2016.
 */
cracApp.controller('myCompetenciesInfoCtrl', ['$rootScope','$scope', '$stateParams','UserDataService', '$ionicModal','$state', 'ionicToast',
  function($rootScope, $scope, $stateParams, UserDataService, $ionicModal, $state, ionicToast) {
    $scope.editFlag =true;
    console.log("Userid: " +$rootScope.globals.currentUser.id);
    UserDataService.getUserById($rootScope.globals.currentUser.id).then(function(res) {
      $scope.user = res.object;
      console.log($scope.user);
    }, function(error) {
      ionicToast.show("Benutzerinformation kann nicht geladen werden: " + error.message, 'top', false, 5000);
    });

    UserDataService.getCompRelationships().then(function(res){
      $scope.competenceInfo = res.object[$stateParams.index];
      console.log($scope.competenceInfo);
    }, function(error) {
      //@TODO error shows when user has no competences, should come as success
    });

    $scope.remove = function(){
      UserDataService.removeCompetence($scope.competenceInfo.competence.id).then(function(res){
        $state.go('tabsController.myCompetencies');
      }, function(error) {
        ionicToast.show("Kompetenz kann nicht gelöscht werden: " + error.message, 'top', false, 5000);
      });
    };
    $scope.edit = function(){
      $scope.editFlag =false;
    };

    $scope.save = function(){
      UserDataService.updateCompetence($scope.competenceInfo.competence.id,$scope.competenceInfo.likeValue,$scope.competenceInfo.proficiencyValue).then(function(res){
        $state.go('tabsController.myCompetencies');
      }, function(error) {
        ionicToast.show("Kompetenz kann nicht gespeichert werden: " + error.message, 'top', false, 5000);
      });
    };

}]);
