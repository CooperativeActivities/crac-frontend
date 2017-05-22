cracApp.component("sideMenu", {
  templateUrl: "components/sideMenu/sideMenu.html",
  controller:  ['$scope','$rootScope', '$stateParams','UserDataService','ionicToast',
    function ($scope,$rootScope, $stateParams, UserDataService, ionicToast) {
      //console.log("globals", $rootScope.globals);
      $rootScope.$on("loggedIn", function(){
        console.log("loggedIn")
        if ($rootScope.globals.hasOwnProperty("currentUser")) {
          UserDataService.getUserById($rootScope.globals.currentUser.id).then(function (res) {
            UserDataService.getCompRelationships().then(function(res){
              $rootScope.globals.userInfoCompetences = res.object;
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
            ionicToast.show("Benutzerinformation konnte nicht geladen werden: " + error.message, 'top', false, 5000)
            if(error.message === "Sie sind nicht eingeloggt."){
              $state.go('login');
            }
          });
        }
      })
      if($rootScope.globals.currentUser && !$rootScope.globals.userInfo){
        $rootScope.$emit("loggedIn")
      }
    }]
})
