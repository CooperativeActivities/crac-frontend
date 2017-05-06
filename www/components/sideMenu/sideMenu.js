cracApp.component("sideMenu", {
  templateUrl: "components/sideMenu/sideMenu.html",
  controller:  ['$scope','$rootScope', '$stateParams','UserDataService','$ionicPopup',
    function ($scope,$rootScope, $stateParams, UserDataService, $ionicPopup) {
      //console.log("globals", $rootScope.globals);
      $rootScope.$watch(['globals.hasOwnProperty'], function() {
        if ($rootScope.globals.hasOwnProperty("currentUser")) {
          UserDataService.getUserById($rootScope.globals.currentUser.id).then(function (res) {
            UserDataService.getCompRelationships().then(function(res){
              $rootScope.globals.userInfoCompetences = res.data;
            }, function(error){
              // this error happens when the user has no competences assigned
              // just catching this error cause i don't want it to clutter the console
              //@TODO Should this really be an error?
            });
            var user = res.object;
            $scope.user = user;
            $rootScope.globals.userInfo = user;
            //console.log("user", $scope.user);

          }, function (error) {
            $ionicPopup.alert({
              title: "Benutzerinformation konnte nicht geladen werden",
              template: error.message,
              okType: 'button-positive button-outline'
            });
            if(error.message === "Sie sind nicht eingeloggt."){
              $state.go('login');
            }
          });
        }
      })
    }]
})
