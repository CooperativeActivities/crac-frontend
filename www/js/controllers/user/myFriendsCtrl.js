cracApp.controller('myFriendsCtrl', ['$rootScope','$scope','UserDataService','$ionicPopup',
  function($rootScope, $scope, UserDataService, $ionicPopup) {
    $scope.friends = []
    $scope.allUsers = []
    $scope.select = {
      userToSendRequestTo: null
    }
    $scope.reload = function(){
      UserDataService.getFriends().then(function(res){
        $scope.friends = res.object
      }, function(error){
        $ionicPopup.alert({
          title: "Freunde können nicht geladen werden",
          template: error.message,
          okType: 'button-positive button-outline'
        });
      })
      UserDataService.getAllUsers().then(function(res){
        $scope.allUsers = res.object
      }, function(error){
        $ionicPopup.alert({
          title: "Benutzer können nicht geladen werden",
          template: error.message,
          okType: 'button-positive button-outline'
        });
      })
    };

    $scope.sendRequest = function(){
      if($scope.select.userToSendRequestTo){
        UserDataService.friendRequest($scope.select.userToSendRequestTo).then(function(res){
          $ionicPopup.alert({
            title: "Freundschaftsanfrage versandt",
            okType: 'button-positive button-outline'
          });
          $scope.reload()
        }, function(error){
          $ionicPopup.alert({
            title: "Freundschaftsanfrage fehlgeschlagen",
            template: error.message,
            okType: 'button-positive button-outline'
          });
        })
      }
    }

    $scope.reload()
}]);
