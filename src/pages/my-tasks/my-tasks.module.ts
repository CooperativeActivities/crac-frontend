import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyTasksPage } from './my-tasks';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    MyTasksPage,
  ],
  imports: [
    IonicPageModule.forChild(MyTasksPage),
    ComponentsModule,
  ],
  exports: [
    MyTasksPage
  ]
})
export class MyTasksPageModule {}
