cracApp.controller('messagingCtrl', ['$scope', '$stateParams','UserDataService', "$q",
  function ($scope, $stateParams, UserDataService, $q) {
    $scope.reload = function(){
      UserDataService.getNotification().then(function(res){
        var notifications = JSON.parse(res.object);
        var promises = []
        notifications.forEach(function(notification){
          if(notification.name = "Friend Request"){
            promises.push(UserDataService.getUserById(notification.senderId).then(function(res){
              notification.user = res.object
            }))
          }
        })
        return $q.all(promises).then(function(){
          $scope.notifications = notifications
        })
      }, function(error) {
        console.log('An error occurred!', error);
      }).then(function(){
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.accept = function (notification){
      console.log(notification)
      UserDataService.acceptNotification(notification.notificationId).then(function(){
        $scope.reload()
      })
    }
    $scope.decline = function (notification){
      UserDataService.declineNotification(notification.notificationId).then(function(){
        $scope.reload()
      })
    }
    $scope.reload()
  }])
