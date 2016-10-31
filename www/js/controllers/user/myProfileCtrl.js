/**
 * Created by P23460 on 13.10.2016.
 */
cracApp.controller('myProfileCtrl', function($rootScope,$scope, $http, $ionicModal,UserDataService) {
  console.log("Userid: " +$rootScope.globals.currentUser.id)
  UserDataService.getUserById($rootScope.globals.currentUser.id).then(function(res) {
    $scope.user = res.data;
    console.log($scope.user)
  }, function(error) {
    console.log('An error occurred!', error);
  });
  $scope.save = function(){
    var profileData = {};
    profileData.name= $scope.user.name;
    profileData.firstName= $scope.user.firstName;
    profileData.lastName= $scope.user.lastName;
    profileData.phone= $scope.user.phone;
    profileData.email= $scope.user.email;

    UserDataService.updateCurrentUser(profileData).then(function(res) {
      console.log(profileData);
      console.log(res.data)
    }, function(error) {
      console.log('An error occurred!', error);
    });
  };
  // Picture Change expand modal
 /* $ionicModal.fromTemplateUrl('profileimage-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  }); */

})
