import { Component } from '@angular/core';
import { AuthService } from '../../services/auth_service';
import { ModalController } from 'ionic-angular';

@Component({
  templateUrl: 'logoutModal.html'
})
export class LogoutModal {
  constructor(private authService: AuthService, private modalCtrl: ModalController) { }
  logout(){
    console.log("logout");
    this.authService.logout();
    //$scope.modal.hide();
  }
  closeModal(){
    console.log("closeModal");
    //$scope.modal.hide();
  }
}
/*
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



    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
})
 */
