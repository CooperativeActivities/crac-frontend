/**
 * Created by P41332 on 25.10.2016.
 */

cracApp.controller('myCrAcMenuCtrl', ['$scope','$rootScope', '$stateParams','UserDataService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope,$rootScope, $stateParams, UserDataService) {
    console.log($rootScope.globals);
    if ($rootScope.globals.hasOwnProperty("currentUser")) {
      UserDataService.getUserById($rootScope.globals.currentUser.id).then(function (res) {
        $scope.user = res.data;
        console.log($scope.user)

      }, function (error) {
        console.log('An error occurred!', error);
      });
    }
  }])
