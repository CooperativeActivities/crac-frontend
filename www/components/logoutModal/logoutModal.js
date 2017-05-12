// IMPORTANT:
// this isn't an actual controller,
// since the "logoutCtrl" actually is attached to the body
// (and just makes use of the template)
//
// I moved the controller to the sidebar so it is no longer attached to body - pn 12.05.17

cracApp.controller('logoutCtrl', function($scope, $ionicModal,$location,AuthenticationService) {

    // Logout Modal
    $ionicModal.fromTemplateUrl('components/logoutModal/logoutModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };


    $scope.logout = function(){
        console.log("logout");
        AuthenticationService.Logout();
        $scope.modal.hide();
        $location.path("/login");
    }

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
    });
})
