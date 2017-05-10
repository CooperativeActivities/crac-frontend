/**
 * Created by x-net on 14.11.2016.
 */
cracApp.controller('addCompetenceCtrl', ['$rootScope', '$scope', 'UserDataService', 'ionicToast', '$state', '$ionicScrollDelegate',
function($rootScope,$scope,UserDataService, ionicToast, $state, $ionicScrollDelegate) {
  UserDataService.getCompetenceAreas()
    .then(function(res) {
      if(res.object.length === 0) {
        ionicToast.show("Keine Kompetenzbereiche gefunden: " + error.message, 'top', false, 5000);
        return;
      }

      var compAreas = res.object;
      compAreas.sort(function(a,b) {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
      $scope.competenceAreaList = compAreas;
    }, function(error) {
      ionicToast.show("Kompetenzbereiche können nicht geladen werden: " + error.message, 'top', false, 5000);
    });

  $scope.onCompetenceAreaChange = function(newValue){
    if(newValue === -1) return;
    UserDataService.getCompetencesForArea(newValue)
      .then(function(res) {
        if(res.meta.competences.length === 0) {
          ionicToast.show("Keine Kompetenzen in diesem Bereich gefunden: " + '', 'top', false, 5000);
          return;
        }

        $scope.competences = res.meta.competences;
      }, function(error) {
        ionicToast.show("Kompetenzen dieses Bereichs können nicht geladen werden: " + error.message, 'top', false, 5000);
      });

  };

  /* $scope.allCompetences= [];
  $scope.myCompetences= [];

  $scope.loadContent = function() {
    UserDataService.allCompetences().then(function (res) {
      $scope.allCompetences = res.data;
      console.log($scope.allCompetences);
      console.log($scope.allCompetences.length);
    }, function (error) {
      console.log('An error occurred!', error);
    });
    UserDataService.getCompRelationships().then(function (res) {
      $scope.myCompetences = res.data;
      console.log($scope.myCompetences);
      console.log($scope.myCompetences.length);
    }, function (error) {
      console.log('An error occurred!', error);
    });
  };
  $scope.$watchGroup(['allCompetences', 'myCompetences'], function() {
    console.log("in");
    var j;
    var i;
    var l=0;
    var kickOut;
    for (j = 0; j < $scope.allCompetences.length; j++) {
      kickOut = false;
      kickOut = $scope.innerFor(i,j,kickOut);

      if (kickOut === false) {
        $scope.competencesPre[l] = $scope.allCompetences[j];
        l++;
      }
    }
    $scope.competences = $scope.competencesPre;
    console.log($scope.competences);
  });

  $scope.innerFor = function(i,j,kickOut) {
    for (i = 0; i < $scope.myCompetences.length; i++) {
      if ($scope.allCompetences[j].id == $scope.myCompetences[i].competence.id) {
        kickOut = true;
        return kickOut;
      }
    }
    return kickOut;
  } */

  $scope.addCompetenceInfo = function(compId){
    $state.go('tabsController.addCompetenceInfo', { id:compId });
  };

  $scope.clearSearch = function() {
    $scope.search = '';
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };
}]);