/**
 * Created by x-net on 09.11.2016.
 */
cracApp.controller('myCompetenciesInfoCtrl', ['$rootScope','$scope', '$stateParams','$routeParams','UserDataService','$http', '$ionicModal','$state',
  function($rootScope, $scope, $stateParams, $routeParams, UserDataService, $http, $ionicModal, $state) {
/*cracApp.controller('myCompetenciesInfoCtrl', ['$scope', '$stateParams','$routeParams','UserDataService','$state',
   function($rootScope,$scope, $http, $stateParams, $ionicModal, UserDataService, state, routeParams) {*/
     console.log("Userid: " +$rootScope.globals.currentUser.id);
  UserDataService.getUserById($rootScope.globals.currentUser.id).then(function(res) {
    $scope.user = res.data;
    console.log($scope.user);
  }, function(error) {
    console.log('An error occurred!', error);
  });
  UserDataService.getCompRelationships().then(function(res){
    $scope.competenceInfo = res.data[$stateParams.index];
    console.log($scope.competenceInfo);

  }, function(error) {
    console.log('An error occurred!', error);
  });

}]);
