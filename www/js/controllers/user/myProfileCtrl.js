/**
 * Created by P23460 on 13.10.2016.
 */
cracApp.controller('myProfileCtrl', function($rootScope,$scope, $http, $ionicModal,UserDataService, navigator) {
  console.log("Userid: " +$rootScope.globals.currentUser.id)
  UserDataService.getUserById($rootScope.globals.currentUser.id).then(function(res) {
    $scope.user = res.data;
    console.log($scope.user)

  }, function(error) {
    console.log('An error occurred!', error);
  });

  $scope.editFlag =true;

  $scope.save = function(){
    var profileData = {};
    profileData.firstName= $scope.user.firstName;
    profileData.lastName= $scope.user.lastName;
    profileData.address= $scope.user.address;
    profileData.phone= $scope.user.phone;
    profileData.email= $scope.user.email;
    profileData.birthDate= $scope.user.birthDate;


    UserDataService.updateCurrentUser(profileData).then(function(res) {
      console.log(profileData);
      console.log(res.data)
      $scope.editFlag =true;
    }, function(error) {
      console.log('An error occurred!', error);
    });
  };
  $scope.edit = function(){
    $scope.editFlag =false;
  };


  //Camera: Take a pic
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
  }



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
