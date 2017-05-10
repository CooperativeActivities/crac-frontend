/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('loginCtrl', function ($rootScope,$scope, ionicToast, $location, AuthenticationService,$ionicSideMenuDelegate) {

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
        ionicToast.show("Login fehlgeschlagen: Username oder Passwort falsch", 'top', false, 5000);
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

