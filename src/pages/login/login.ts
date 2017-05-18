import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from "../../services/auth_service";

import { TabsPage } from "../tabs/tabs"

@IonicPage({
  name: "login",
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public username: string;
  public password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth_service: AuthService) {}

  public async login(){
    let res, err;
    try {
      res = await this.auth_service.login(this.username, this.password)
    } catch(e){
      err = e
    }
    if(err){
      console.error(err)
    } else {
      // has to be TabsPage cause if i do HomePage here it doesn't show the navigation bar
      // (if we want to ensure we show the homepage we might wanna use navCtrl.setPages?)
      this.navCtrl.setRoot(TabsPage)
    }
  }

}
/**
 * Created by P41332 on 25.10.2016.
cracApp.controller('loginCtrl', function ($rootScope, $scope, ionicToast, $location, AuthenticationService, $ionicSideMenuDelegate) {

  // deactivate swipe possibility (for sidebar)
  $ionicSideMenuDelegate.canDragContent(false);
  console.log( $rootScope.globals)

  $scope.data = {}

  $scope.login = function () {

    AuthenticationService.Login($scope.data.username, $scope.data.password, function (response) {
      if (response.success) {
        AuthenticationService.SetCredentials(response);
        $rootScope.$emit("loggedIn")
       // AuthenticationService.SetCredentials($scope.data.username, $scope.data.password, response.id);
        //$scope.loggedIn = true;
        //$scope.hasWrongCredentials = false;
        $ionicSideMenuDelegate.canDragContent(true);
        $location.path("/tabcontroller/home");

      } else {
        console.log("in login auth no success")
        ionicToast.show("Login fehlgeschlagen: Username oder Passwort falsch", 'top', false, 5000);
        //$scope.loggedIn = false;
        //$scope.hasWrongCredentials = true;
      }
    });
  }

  //NYI
  $scope.facebookLogin = function(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log('Logged in.');
      }
      else {
        FB.login(function(response){

        });
      }
    });
  }
});

 */
