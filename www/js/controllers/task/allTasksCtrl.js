/**
 * Created by P41332 on 25.10.2016.
 */

/*
 cracApp.controller('allTasksCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
 // You can include any angular dependencies as parameters for this function
 // TIP: Access Route Parameters for your page via $stateParams.parameterName
 function ($scope, $stateParams) {


 }])
 */

cracApp.controller('allTasksCtrl', function ($rootScope, $scope, $http, $ionicModal, TaskDataService) {
  console.log("Taskdata: " + $rootScope.globals.currentUser)


  TaskDataService.getAllTasks().then(function (res) {
    $scope.task = res.data;
    console.log("scope.task = " + $scope.task);
    angular.forEach($scope.task, function(item){
      console.log("taskname " + item.name);
    })
  }, function (error) {
    console.log('An error occurred!', error);
  });
})
