import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

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
  private editFlag = true;

  constructor(public navCtrl: NavController, public userDataService: UserDataService) { }

  ngOnInit(): void {
    this.userDataService.getCurrentUser().then((res) => {
      this.user = res.object
    }).catch((err)=>{
      console.log(err)
      //ionicToast.show("Benutzerinformation kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
    })
  }

  save(){
    var profileData : any = {};
    profileData.firstName= this.user.firstName;
    profileData.lastName= this.user.lastName;
    profileData.address= this.user.address;
    profileData.phone= this.user.phone;
    profileData.email= this.user.email;
    profileData.birthDate= this.user.birthDate;


    this.userDataService.updateCurrentUser(profileData).then(function(res) {
      console.log(profileData);
      console.log(res.data);
      this.editFlag =true;
    }, function(error) {
      console.log(error)
      //ionicToast.show("Account kann nicht gespeichert werden: " + error.message, 'top', false, 5000);
    });
  }
  edit(){
    this.editFlag =false;
  };

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

