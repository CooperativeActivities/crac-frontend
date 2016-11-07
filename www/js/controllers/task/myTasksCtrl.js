/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('myTasksCtrl', ['$scope', '$stateParams','$routeParams','TaskDataService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, TaskDataService) {

  TaskDataService.getMyTasks().then(function(res) {
    console.log(res.data);
  }, function(error) {
    console.log('An error occurred!', error);
  });

}])
