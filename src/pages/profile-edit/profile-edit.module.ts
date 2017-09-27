import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileEditPage } from './profile-edit';
import { ComponentsModule } from "../../components/components.module"
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {Camera} from "@ionic-native/camera";
import {PhoneNumberValidator} from "../../directives/phone-number";

@NgModule({
  declarations: [
    ProfileEditPage,
    PhoneNumberValidator
  ],
  imports: [
    IonicPageModule.forChild(ProfileEditPage),
    ComponentsModule,
  ],
  exports: [
    ProfileEditPage
  ],
  providers: [
    File,
    Transfer,
    FilePath,
    Camera
  ]
})
export class ProfileEditPageModule {}
