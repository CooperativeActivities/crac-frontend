import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthService {
  // URL to REST-Service
  private _baseURL = (<any>window).crac_config.SERVER;
  public token: string;
  public user: any;
  constructor(private http: Http, public storage: Storage) { }
  isAuthenticated(): boolean {
    return !!this.token
  }

  public getAuthRequestOptions(): RequestOptions {
    return new RequestOptions({ headers: new Headers({ 'Token': this.token, "Authorization": "Basic Og==" }) });
  }

  async login(username, password): Promise<any> {
    let authdata = Base64.encode(username + ':' + password);
    let auth = `Basic ${authdata}`

    let options = new RequestOptions({ headers: new Headers({ 'Authorization': auth }) });
    let url = this._baseURL + '/user/login';
    let res = await this.http.get(url, options)
    .toPromise().then(res => res.json())
    if (!res.success) {
      throw res
    }
    console.log("Login successful", res);
    this.token = res.object.code;
    this.setCredentials(this.token)
    await this.loadUser()
    return res
  }

  async setCredentials(token: string){
    await this.storage.ready()
    await this.storage.set("token", token)
  }

  async getCredentials(): Promise<string>{
    await this.storage.ready()
    let token = await this.storage.get("token")
    if(token){
      this.token = token
      await this.loadUser()
      return token
    }
  }
  async loadUser(){
    if(!this.token){
      throw new Error("not authenticated")
    }
    let options = this.getAuthRequestOptions()
    let url = this._baseURL + '/user';
    let user = await this.http.get(url, options).toPromise()
      .then(res => res.json())
    this.user = user.object
    return this.user
  }

  async clearCredentials(){
    await this.storage.ready()
    await this.storage.remove("token")
  }
  async logout(){
    await this.clearCredentials()
    window.location.reload()
  }
  async superLogout(){
    let options = this.getAuthRequestOptions()
    await this.http.get(this._baseURL + '/user/logout', options)
    await this.clearCredentials()
    window.location.reload()
  }

};

/*
  SetCredentials(response) {
    //var authdata = Base64.encode(username + ':' + password);

    $rootScope.globals = {
      currentUser: {
        user: response.meta.user,
        id: response.object.userId,
        //authdata: authdata,
        token : response.object.code,
        roles : response.meta.roles
      }
    };

    //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
    $http.defaults.headers.common["Token"] = response.token;
    $cookieStore.put('globals', $rootScope.globals);
  }

  function SuperLogout() {
    $http.get(baseURL+'/user/logout').success(function(response){
      ClearCredentials();
      window.location.reload()
    }).
      error(function(response){
        console.log("Logout failed");
      });

  }
  function Logout() {
    ClearCredentials();
    window.location.reload()
  }

  function ClearCredentials() {
    $rootScope.globals = {};
    $cookieStore.remove('globals');
    $http.defaults.headers.common["Token"] = "";
    $http.defaults.headers.common.Authorization = 'Basic';

  }
}
 */

// Base64 encoding service used by AuthenticationService
var Base64 = {

  keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  encode (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this.keyStr.charAt(enc1) +
        this.keyStr.charAt(enc2) +
        this.keyStr.charAt(enc3) +
        this.keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = null;
      enc1 = enc2 = enc3 = enc4 = null;
    } while (i < input.length);

    return output;
  },

  decode (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
      console.error("There were invalid base64 characters in the input text.\n" +
        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
        "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
      enc1 = this.keyStr.indexOf(input.charAt(i++));
      enc2 = this.keyStr.indexOf(input.charAt(i++));
      enc3 = this.keyStr.indexOf(input.charAt(i++));
      enc4 = this.keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

      chr1 = chr2 = chr3 = null;
      enc1 = enc2 = enc3 = enc4 = null;

    } while (i < input.length);

    return output;
  }
};

