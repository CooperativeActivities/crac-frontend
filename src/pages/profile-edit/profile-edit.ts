import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController, Platform, LoadingController, Loading} from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { UserDataService } from '../../services/user_service';

declare let cordova: any;

@IonicPage({
  name: "profile-edit",
})
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
  providers: [ UserDataService ],
})

export class ProfileEditPage {
  public user: any;
  profileImg: string = 'assets/img/avatar-placeholder1.png';
  minimumDate: string;
  maximumDate: string;

  lastImage: string = null;
  loading: Loading;

  constructor(public navCtrl: NavController, public userDataService: UserDataService, public toast: ToastController,
              private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath,
              public platform: Platform, public loadingCtrl: LoadingController) { }
  ngOnInit(): void {
    this.userDataService.getCurrentUser().then((res) => {
      this.user = res.object;
      if(this.user.birthDate) {
        this.user.birthDate = this.getDateString(new Date(this.user.birthDate));
      }
    }).catch((error)=>{
      console.log(error);
      this.toast.create({
        message: "Benutzerinformation kann nicht gefolgt werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });

    let now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    this.maximumDate = this.getDateString(now);

    now.setFullYear(now.getFullYear() - 80);
    this.minimumDate = this.getDateString(now);
  }

  getDateString(d){
    let tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = (num) => {
        let norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return d.getFullYear() +
      '-' + pad(d.getMonth() + 1) +
      '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) +
      ':' + pad(d.getMinutes()) +
      ':' + pad(d.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }

  toTimestamp(datestring): Number {
    if(!datestring) return
    if(!isNaN(datestring)) return datestring;
    let date = Date.parse(datestring)
    if(isNaN(date)) return
    return date
  }

  takePicture(sourceType, destinationType) {
    let options = {
      quality: 100,
      sourceType: sourceType,
      destinationType: destinationType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if(destinationType === this.camera.DestinationType.FILE_URI) {
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
        } else {
          let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
      }
      else
      {
        this.uploadBase64(imagePath);
      }
    }, (err) => {
      console.log(err);
      this.toast.create({
        message: "Foto konnte nicht hochgeladen werden: " + err.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  uploadBase64(img) {
    let b64img = 'data:image/jpeg;base64,' + img;
    let form = document.getElementById('uploadForm');
    let block = b64img.split(';');
    let contentType = block[0].split(':')[1];
    let realData = block[1].split(',')[1];
    let blob = this.b64toBlob(realData, contentType);
    let formData = new FormData(<HTMLFormElement>form);
    formData.append('uploadFile', blob);
    console.log(formData);
    this.userDataService.uploadProfileImage(formData).then((res) => {
      console.log(res);
      this.profileImg = b64img;

      this.toast.create({
        message: "Foto hochgeladen",
        position: 'top',
        duration: 3000
      }).present();
    }, (err) => {
      console.log(err);
      this.toast.create({
        message: "Foto konnte nicht hochgeladen werden: " + err.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  // Create a new name for the image
  createFileName() {
    let d = new Date(),
      n = d.getTime();
    return n + ".jpg";
  }

  // Copy the image to a local folder
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, err => {
      this.toast.create({
        message: "Foto konnte nicht hochgeladen werden: " + err.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  // Always get the accurate path to your apps folder
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  libraryPicture() {
    if(this.platform.is('core')) {
      this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.DestinationType.DATA_URL);
    } else {
      this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.DestinationType.FILE_URI);
    }
  }

  cameraPicture() {
    if(this.platform.is('core')) {
      this.takePicture(this.camera.PictureSourceType.CAMERA, this.camera.DestinationType.DATA_URL);
    } else {
      this.takePicture(this.camera.PictureSourceType.CAMERA, this.camera.DestinationType.FILE_URI);
    }
  }

  uploadImage() {
    //@TODO implement actual upload api
    console.log('image upload!');
    return;
/*
    // Destination URL
    let url = "http://yoururl/upload.php";

    // File for Upload
    let targetPath = this.pathForImage(this.lastImage);

    // File name only
    let filename = this.lastImage;

    let options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll();
      this.toast.create({
        message: "Foto wird hochgeladen",
        position: 'top',
        duration: 3000
      }).present();
    }, err => {
      this.loading.dismissAll();
      this.toast.create({
        message: "Foto konnte nicht hochgeladen werden: " + err.message,
        position: 'top',
        duration: 3000
      }).present();
    });
    */
  }

  save_changes(){
    let profileData : any = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      address: this.user.address,
      phone: this.user.phone,
      email: this.user.email,
      birthDate: this.toTimestamp(this.user.birthDate),
    };


    this.userDataService.updateCurrentUser(profileData).then(res => {
      this.toast.create({
        message: "Account gespeichert",
        position: 'top',
        duration: 3000
      }).present();
      this.navCtrl.pop()
    }, error => {
      console.log(error);
      this.toast.create({
        message: "Account kann nicht gespeichert werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }
  cancel(){
    this.navCtrl.pop()
  }

}
