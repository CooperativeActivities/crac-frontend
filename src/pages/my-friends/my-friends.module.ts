import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyFriendsPage } from './my-friends';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    MyFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyFriendsPage),
    ComponentsModule,
  ],
  exports: [
    MyFriendsPage
  ]
})
export class MyFriendsPageModule {}
