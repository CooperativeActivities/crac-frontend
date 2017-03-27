/**
 * Created by P41332 on 25.10.2016.
 */
cracApp.controller('homeCtrl', ['$scope', '$stateParams', 'TaskDataService','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, TaskDataService, $state) {

      TaskDataService.getMatchingTasks().then(function(res){
        $scope.tasks = res.object;
      })


    $scope.follow = function(id){
      TaskDataService.changeTaskState(id,'follow').then(function(data) {
        console.log(data);
      }, function(error) {
        console.log('An error occurred!', error);
      });
    };

    $scope.loadSingleTask = function(taskId){
      $state.go('tabsController.task', { id:taskId });
    }


  }])
