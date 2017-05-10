cracApp.controller('myFriendsCtrl', ['$rootScope','$scope','UserDataService','ionicToast',
  function($rootScope, $scope, UserDataService, ionicToast) {
    $scope.friends = []
    $scope.allUsers = []
    $scope.select = {
      userToSendRequestTo: null
    }
    $scope.reload = function(){
      UserDataService.getFriends().then(function(res){
        $scope.friends = res.object
      }, function(error){
        ionicToast.show("Freunde können nicht geladen werden: " + error.message, 'top', false, 5000);
      })
      UserDataService.getAllUsers().then(function(res){
        $scope.allUsers = res.object
      }, function(error){
        ionicToast.show("Benutzer können nicht geladen werden: " + error.message, 'top', false, 5000);
      })
    };

    $scope.sendRequest = function(){
      if($scope.select.userToSendRequestTo){
        UserDataService.friendRequest($scope.select.userToSendRequestTo).then(function(res){
          ionicToast.show("Freundschaftsanfrage versandt", 'top', false, 5000)
          $scope.reload()
        }, function(error){
          ionicToast.show("Freundschaftsanfrage fehlgeschlagen: " + error.message, 'top', false, 5000);
        })
      }
    }

    $scope.reload()
}]);
