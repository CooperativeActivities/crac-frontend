/**
 * Created by x-net on 10.11.2016.
 */
cracApp.controller('newCompetenceCtrl', ['$route','$scope', '$stateParams','UserDataService','$ionicPopup','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($route,$scope, $stateParams,UserDataService,$ionicPopup,$state) {
  $scope.competence= {};

  $scope.save = function(){
    var competenceData = {};
    competenceData.name= $scope.competence.name;
    competenceData.description= $scope.competence.description;

    console.log($scope.competence);

    UserDataService.createNewCompetence(competenceData).then(function(res) {
      console.log(competenceData);
      console.log(res.object);
      $route.reload();
      $state.go('tabsController.myCompetencies');
    }, function(error) {
      $ionicPopup.alert({
        title: "Kompetenz kann nicht erstellt werden",
        template: error.message,
        okType: 'button-positive button-outline'
      });
    });
  };
}]);
