import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileDetailsPage } from './profile-details';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    ProfileDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileDetailsPage),
    ComponentsModule,
  ],
  exports: [
    ProfileDetailsPage
  ]
})
export class MyProfilePageModule {}
