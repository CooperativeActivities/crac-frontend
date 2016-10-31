/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('myCompetenciesCtrl', function($rootScope,$scope, $http, $ionicModal,UserDataService) {
  console.log("Userid: " +$rootScope.globals.currentUser.id)
  UserDataService.getUserById($rootScope.globals.currentUser.id).then(function(res) {
    $scope.user = res.data;
    console.log($scope.user)
  }, function(error) {
    console.log('An error occurred!', error);
  });


  })
