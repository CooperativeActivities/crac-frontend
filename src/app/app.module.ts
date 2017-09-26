import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';


import { MyApp } from './app.component';

import { LogoutModal } from '../components/logoutModal/logoutModal';

import { HelperService } from "../services/helpers";
import { AuthService } from "../services/auth_service";
import { ErrorDisplayService } from '../services/error_service';


@NgModule({
  declarations: [
    MyApp,
    LogoutModal,
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      // @TODO: is this a good idea?
      mode: "md",
      backButtonText: "",
      iconMode: "md",
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    BrowserModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LogoutModal,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HelperService,
    AuthService,
    ErrorDisplayService,
    Geolocation,
    StatusBar,
    SplashScreen
  ]
})
export class AppModule {}
