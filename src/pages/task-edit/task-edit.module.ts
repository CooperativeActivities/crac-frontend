import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskEditPage } from './task-edit';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    TaskEditPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskEditPage),
    ComponentsModule,
  ],
  exports: [
    TaskEditPage
  ]
})
export class TaskEditPageModule {}
