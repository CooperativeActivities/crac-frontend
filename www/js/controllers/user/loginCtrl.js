/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('loginCtrl', function ($scope, $ionicPopup, $location, AuthenticationService) {

  $scope.data = {}

  $scope.login = function () {
    console.log("in login");

    AuthenticationService.Login($scope.data.username, $scope.data.password, function (response) {
      if (response.success) {
        console.log("in login auth success");
        AuthenticationService.SetCredentials($scope.data.username, $scope.data.password, response.id);
        //$scope.loggedIn = true;
        //$scope.hasWrongCredentials = false;
        $location.path("/tabcontroller/tab1/home");

      } else {
        console.log("in login auth no success")
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
        //$scope.loggedIn = false;
        //$scope.hasWrongCredentials = true;
      }
    });
  }
});


/*
 .controller('loginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
 // You can include any angular dependencies as parameters for this function
 // TIP: Access Route Parameters for your page via $stateParams.parameterName
 function ($scope, $stateParams) {


 }])
 */

/*
 .controller('loginCtrl', function($scope, LoginService, $ionicPopup, $state) {
 $scope.data = {};

 $scope.login = function() {
 LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
 $state.go('tabsController.startseite');
 }).error(function(data) {
 var alertPopup = $ionicPopup.alert({
 title: 'Login failed!',
 template: 'Please check your credentials!'
 });
 $state.go('anmelden');
 });
 }
 }) */
