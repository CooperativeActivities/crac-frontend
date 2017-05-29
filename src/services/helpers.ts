import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ErrorDisplayService } from './error_service';
import { AuthService } from './auth_service';

@Injectable()
export class HelperService {
  // URL to REST-Service
  private _baseURL = (<any>window).crac_config.SERVER;
  constructor(private http: Http, private errorDisplayService: ErrorDisplayService, private authService: AuthService) { }

  ajax(path, method, { handleSpecificErrors = (response)=>{}, payload = null, transformResponse = (response)=>response } = {}): Promise<any>{
    let options = this.authService.getAuthRequestOptions()
    let promise: any;
    let url = this._baseURL + path;
    // maybe make this a bit more resilient, a put called without payload will give a 401 cause no auth
    if(method === "put" || method === "patch" || method === "post"){
      promise = this.http[method](url, payload, options)
    } else {
      promise = this.http[method](url, options)
    }

    return promise.toPromise()
      .then((res) => res.json()).then((response)=>{
        if(response &&  response.success){ return transformResponse(response); }
        else {
          throw response
        }
      }, function(response){
        // handle specific errors first since we might want to have a special message for 404, for example
        var res = handleSpecificErrors(response);
        // if the function returned something instead of throwing, we return that - prevents errors from throwing
        if(res){ return res; }

        switch(response.status)
        {
          case -1:
            throw { error: response, message: "Keine Verbindung" };
          case 401:
            throw { error: response, message: "Sie sind nicht eingeloggt." };
          case 404:
            throw { error: response, message: "Resource nicht gefunden" };
          case 400:
            if(response && response.errors){
              throw { error: response, message: "hi" /*this.errorDisplayService.getMessagesFromCodes(response.data.errors)*/ };
            }
            break;
        }
        throw { error: response, message: "Anderer Fehler" };
      });
  };
};
