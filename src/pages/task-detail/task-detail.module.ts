import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskDetailPage } from './task-detail';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    TaskDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskDetailPage),
    ComponentsModule,
  ],
  exports: [
    TaskDetailPage
  ]
})
export class TaskDetailPageModule {}
