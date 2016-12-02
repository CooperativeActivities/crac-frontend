/**
 * Created by x-net on 14.11.2016.
 */
cracApp.controller('addCompetenceInfoCtrl', ['$rootScope','$scope','$window', '$stateParams','$routeParams','UserDataService','$http', '$ionicModal','$state',
  function($rootScope, $scope, $window, $stateParams, $routeParams, UserDataService, $http, $ionicModal, $state) {
    console.log("Userid: " +$rootScope.globals.currentUser.id);

      $scope.competenceInfoPre = UserDataService.getCompetenceData();
      $scope.competenceInfo = $scope.competenceInfoPre[0][$stateParams.index];
      $scope.competenceInfo.likeValue = 50;
      $scope.competenceInfo.proficiencyValue = 50;
      console.log($scope.competenceInfo);
    console.log($scope.competenceInfoPre);

    $scope.add = function(){
      UserDataService.addLikeProfValue($scope.competenceInfo.id,$scope.competenceInfo.likeValue,$scope.competenceInfo.proficiencyValue).then(function(res){
        console.log($scope.competenceInfo);
        //$window.location.reload();
        $state.go('tabsController.myCompetencies');
      }, function(error) {
        console.log('An error occurred!', error);
      });
    }

  }]);
