import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskEditPage } from './task-edit';

@NgModule({
  declarations: [
    TaskEditPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskEditPage),
  ],
  exports: [
    TaskEditPage
  ]
})
export class TaskEditPageModule {}
