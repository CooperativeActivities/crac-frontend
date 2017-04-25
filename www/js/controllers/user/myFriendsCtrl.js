cracApp.controller('myFriendsCtrl', ['$rootScope','$scope','UserDataService','$ionicPopup',
  function($rootScope, $scope, UserDataService, $ionicPopup) {
    $scope.reload = function(){
      console.log("Userid: " +$rootScope.globals.currentUser.id);
    };

    $scope.reload()
}]);
