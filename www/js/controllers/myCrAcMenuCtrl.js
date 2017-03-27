/**
 * Created by P41332 on 25.10.2016.
 */

cracApp.controller('myCrAcMenuCtrl', ['$scope','$rootScope', '$stateParams','UserDataService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope,$rootScope, $stateParams, UserDataService) {
    console.log("globals", $rootScope.globals);
    $rootScope.$watch(['globals.hasOwnProperty'], function() {
      if ($rootScope.globals.hasOwnProperty("currentUser")) {
        UserDataService.getUserById($rootScope.globals.currentUser.id).then(function (res) {
          UserDataService.getCompRelationships().then(function(res){
            $rootScope.globals.userInfoCompetences = res.data;
          }, function(error){
            // this error happens when the user has no competences assigned
            // just catching this error cause i don't want it to clutter the console
          })
          var user = res.object;
          $scope.user = user;
          $rootScope.globals.userInfo = user;
          console.log("user", $scope.user);

        }, function (error) {
          console.log('An error occurred!', error);
        });
      }
    })
  }])
