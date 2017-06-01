import { Component } from '@angular/core';
import {IonicPage, ToastController} from 'ionic-angular';

import { NavController } from 'ionic-angular';
import { UserDataService } from '../../services/user_service';

@IonicPage({
  name: "my-profile",
})
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
  providers: [ UserDataService ],
})
export class MyProfilePage {
  public user: any;

  constructor(public navCtrl: NavController, public userDataService: UserDataService, public toast: ToastController) { }

  ngOnInit(): void {
    let self = this;

    self.userDataService.getCurrentUser().then((res) => {
      self.user = res.object;
    }).catch((error)=>{
      console.log(error);
      self.toast.create({
        message: "Benutzerinformation kann nicht gefolgt werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    })
  }

  save(){
    let self = this;

    let profileData : any = {};
    profileData.firstName= self.user.firstName;
    profileData.lastName= self.user.lastName;
    profileData.address= self.user.address;
    profileData.phone= self.user.phone;
    profileData.email= self.user.email;
    profileData.birthDate= self.user.birthDate;


    self.userDataService.updateCurrentUser(profileData).then(function(res) {
      console.log(profileData);
      console.log(res.data);
      self.toast.create({
        message: "Account gespeichert",
        position: 'top',
        duration: 3000
      }).present();
    }, function(error) {
      console.log(error);
      self.toast.create({
        message: "Account kann nicht gespeichert werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

}




/*  //Camera: Take a pic
  $scope.takePic = function() {
    var options =   {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
      encodingType: 0     // 0=JPG 1=PNG
    }
    navigator.camera.getPicture(onSuccess,onFail,options);
  }
  var onSuccess = function(FILE_URI) {
    console.log(FILE_URI);
    $scope.picData = FILE_URI;
    $scope.$apply();
  };
  var onFail = function(e) {
    console.log("On fail " + e);
  }
  $scope.send = function() {
    var myImg = $scope.picData;
    var options = new FileUploadOptions();
    options.fileKey="post";
    options.chunkedMode = false;
    var params = {};
    params.user_token = localStorage.getItem('auth_token');
    params.user_email = localStorage.getItem('email');
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(myImg, encodeURI("https://example.com/posts/"), onUploadSuccess, onUploadFail, options);
  } */



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

