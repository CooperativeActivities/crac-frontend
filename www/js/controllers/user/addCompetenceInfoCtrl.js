/**
 * Created by x-net on 14.11.2016.
 */
cracApp.controller('addCompetenceInfoCtrl', ['$rootScope','$scope', '$stateParams','$routeParams','UserDataService','$http', '$ionicModal','$state',
  function($rootScope, $scope, $stateParams, $routeParams, UserDataService, $http, $ionicModal, $state) {
    console.log("Userid: " +$rootScope.globals.currentUser.id);
    UserDataService.allCompetences().then(function(res){
      $scope.competenceInfo = res.data[$stateParams.index];
      console.log($scope.competenceInfo);
    }, function(error) {
      console.log('An error occurred!', error);
    });

    $scope.add = function(){
      UserDataService.addLikeProfValue($scope.competenceInfo.id,$scope.competenceInfo.likeValue,$scope.competenceInfo.proficiencyValue).then(function(res){
        console.log($scope.competenceInfo);
        $state.go('tabsController.myCompetencies');
      }, function(error) {
        console.log('An error occurred!', error);
      });
    }

  }]);
