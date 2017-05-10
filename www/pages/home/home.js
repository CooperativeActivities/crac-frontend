/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('homeCtrl', ['$scope', '$stateParams', 'TaskDataService', 'ionicToast', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, TaskDataService, ionicToast, $state) {
    TaskDataService.getMatchingTasks().then(function(res){
      $scope.tasks = res.object;
    }, function(error){
      console.warn("Matching tasks could not be retrieved", error);
    });

    $scope.follow = function(id){
      TaskDataService.changeTaskState(id,'follow').then(function(data) {
        console.log(data);
      }, function(error) {
        ionicToast.show("Aufgabe kann nicht gefolgt werden: " + error.message, 'top', false, 5000)
      });
    };

    $scope.loadSingleTask = function(taskId){
      $state.go('tabsController.task', { id:taskId });
    }
  }]);
