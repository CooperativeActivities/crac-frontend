import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { SettingsPage } from '../pages/settings/settings';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';

import { LogoutModal } from '../components/logoutModal/logoutModal';

import { HelperService } from "../services/helpers";
import { AuthService } from "../services/auth_service";
import { ErrorDisplayService } from '../services/error_service';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    SettingsPage,
    AccountPage,
    LoginPage,
    LogoutModal,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    BrowserModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    AccountPage,
    SettingsPage,
    LoginPage,
    LogoutModal,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HelperService,
    AuthService,
    ErrorDisplayService,
  ]
})
export class AppModule {}
