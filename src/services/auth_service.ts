import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  // URL to REST-Service
  public token: String;
  constructor() { }
  public setToken(token: String){
    this.token = token;
  }
  isAuthenticated(): boolean {
    return !!this.token
  }

};
