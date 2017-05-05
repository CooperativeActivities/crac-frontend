/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('loginCtrl', function ($rootScope,$scope, $ionicPopup, $location, AuthenticationService,$ionicSideMenuDelegate) {

  // deactivate swipe possibility (for sidebar)
  $ionicSideMenuDelegate.canDragContent(false);
  console.log( $rootScope.globals)

  $scope.data = {}

  $scope.login = function () {

    AuthenticationService.Login($scope.data.username, $scope.data.password, function (response) {
      if (response.success) {
        AuthenticationService.SetCredentials(response);
       // AuthenticationService.SetCredentials($scope.data.username, $scope.data.password, response.id);
        //$scope.loggedIn = true;
        //$scope.hasWrongCredentials = false;
        $ionicSideMenuDelegate.canDragContent(true);
        $location.path("/tabcontroller/home");

      } else {
        console.log("in login auth no success")
        var alertPopup = $ionicPopup.alert({
          title: 'Login fehlgeschlagen!',
          template: 'Username oder Passwort falsch',
          okType: "button-positive button-outline"
        });
        //$scope.loggedIn = false;
        //$scope.hasWrongCredentials = true;
      }
    });
  }

  //NYI
  $scope.facebookLogin = function(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log('Logged in.');
      }
      else {
        FB.login(function(response){

        });
      }
    });
  }
});

