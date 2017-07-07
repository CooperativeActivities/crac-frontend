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

  async ajax(path, method, { handleSpecificErrors = (response, responseData)=>{}, payload = null, transformResponse = (response)=>response } = {}): Promise<any>{
    let options = this.authService.getAuthRequestOptions()
    let promise: any;
    let url = this._baseURL + path;
    if(method === "put" || method === "patch" || method === "post"){
      promise = this.http[method](url, payload, options)
    } else {
      promise = this.http[method](url, options)
    }

    return promise.toPromise().then(res => res.json())
    .then(
      (response)=>{
        if(response && response.success){ return transformResponse(response); }
        else { throw response }
      },
      // error handler
      async (response: Response) => {
        if(response.status === 0 || response.status === -1){
          throw { error: response, message: "Keine Verbindung" };
        }
        let responseData
        try{ responseData = await response.json() }
        catch(e){ }
        // handle specific errors first since we might want to have a special message for 404, for example
        var res = handleSpecificErrors(response, responseData);
        // if the function returned something instead of throwing, we return that - prevents errors from throwing
        if(res){ return res; }

        switch(response.status)
        {
          case 401:
            throw { error: response, data: responseData, message: "Sie sind nicht eingeloggt." };
          case 404:
            throw { error: response, data: responseData, message: "Resource nicht gefunden" };
          case 400:
            if(responseData && responseData.errors){
              throw { error: response, message: this.errorDisplayService.getMessagesFromCodes(responseData.errors) };
            }
            break;
        }
        throw { error: response, data: responseData, message: "Anderer Fehler" };
      });
  };
};
