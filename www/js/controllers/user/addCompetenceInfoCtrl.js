/**
 * Created by x-net on 14.11.2016.
 */
cracApp.controller('addCompetenceInfoCtrl', ['$rootScope','$scope', '$stateParams','UserDataService', '$ionicModal','$state',
  function($rootScope, $scope, $stateParams, UserDataService, $ionicModal, $state) {
    console.log("Userid: " +$rootScope.globals.currentUser.id);
    console.log("id: " +$stateParams.id);
    UserDataService.getCompetenceById($stateParams.id).then(function (res) {
      $scope.competenceInfo= res.object;
      $scope.competenceInfo.likeValue = 50;
      $scope.competenceInfo.proficiencyValue = 50;
      console.log($scope.competenceInfo);
    }, function (error) {
      $ionicPopup.alert({
        title: "Kompetenz kann nicht geladen werden",
        template: error.message,
        okType: 'button-positive button-outline'
      });
    });

    $scope.add = function(){
      UserDataService.addLikeProfValue($scope.competenceInfo.id,$scope.competenceInfo.likeValue,$scope.competenceInfo.proficiencyValue).then(function(res){
        console.log($scope.competenceInfo);
        $state.go('tabsController.myCompetencies');
      }, function(error) {
        $ionicPopup.alert({
          title: "Kompetenzen kann nicht hinzufügen werden",
          template: error.message,
          okType: 'button-positive button-outline'
        });
      });
    }

  }]);
