import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileEditPage } from './profile-edit';
import { ComponentsModule } from "../../components/components.module"
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
  ]
})
export class MyProfilePageModule {}
