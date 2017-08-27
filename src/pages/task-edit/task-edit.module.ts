import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskEditPage } from './task-edit';
import { ComponentsModule } from "../../components/components.module"
import { MinValueValidator } from "../../directives/min-value";

@NgModule({
  declarations: [
    TaskEditPage,
    MinValueValidator
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
