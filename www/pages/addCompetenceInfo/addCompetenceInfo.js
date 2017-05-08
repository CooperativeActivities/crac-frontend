/**
 * Created by x-net on 14.11.2016.
 */
cracApp.controller('addCompetenceInfoCtrl', ['$rootScope','$scope', '$stateParams','UserDataService', '$ionicModal','$state', 'ionicToast'
  function($rootScope, $scope, $stateParams, UserDataService, $ionicModal, $state, ionicToast) {
    console.log("Userid: " +$rootScope.globals.currentUser.id);
    console.log("id: " +$stateParams.id);
    UserDataService.getCompetenceById($stateParams.id).then(function (res) {
      $scope.competenceInfo= res.object;
      $scope.competenceInfo.likeValue = 50;
      $scope.competenceInfo.proficiencyValue = 50;
      console.log($scope.competenceInfo);
    }, function (error) {
      ionicToast.show("Kompetenz kann nicht geladen werden: " + error.message, 'top', false, 5000);
    });

    $scope.add = function(){
      UserDataService.addLikeProfValue($scope.competenceInfo.id,$scope.competenceInfo.likeValue,$scope.competenceInfo.proficiencyValue).then(function(res){
        console.log($scope.competenceInfo);
        $state.go('tabsController.myCompetencies');
      }, function(error) {
        ionicToast.show("Kompetenzen kann nicht hinzufügen werden: " + error.message, 'top', false, 5000);
      });
    }

  }]);
