/**
 * Created by x-net on 10.11.2016.
 */
cracApp.controller('newCompetenceCtrl', ['$scope', '$stateParams','$routeParams','UserDataService','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams,$routeParams,UserDataService,$state) {

    $scope.competence= {};

    $scope.save = function(){
      var competenceData = {};
      competenceData.name= $scope.competence.name;
      competenceData.description= $scope.competence.description;

      console.log($scope.competence);

      UserDataService.createNewCompetence(competenceData).then(function(res) {
        console.log(competenceData);
        console.log(res.data);
      }, function(error) {
        console.log('An error occurred!', error);
      });
    };

  }])
