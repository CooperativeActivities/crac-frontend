import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskListPage } from './task-list';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    TaskListPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskListPage),
    ComponentsModule,
  ],
  exports: [
    TaskListPage
  ]
})
export class TaskListPageModule {}
