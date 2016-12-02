/**
 * Created by x-net on 14.11.2016.
 */
cracApp.controller('addCompetenceCtrl', function($rootScope,$scope, $http, $ionicModal,UserDataService, $state) {


  $scope.competencesPre = [];
  $scope.allCompetences= [];
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
      for (i = 0; i < $scope.myCompetences.length; i++) {
        if ($scope.allCompetences[j].id == $scope.myCompetences[i].competence.id) {
          kickOut = true;
          break;
        }
      }
      if (kickOut == false) {
        $scope.competencesPre[l] = $scope.allCompetences[j];
        l++;
      }
    }
    $scope.competences = $scope.competencesPre;
    console.log($scope.competences);
  });


  $scope.addCompetenceInfo = function(indx){
    $state.go('tabsController.addCompetenceInfo', { index:indx });
  };

  $scope.clearSearch = function() {
    $scope.search = '';
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };

  $scope.loadContent();

  })
