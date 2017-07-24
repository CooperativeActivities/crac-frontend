import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskEditPage } from './task-edit';
import { ComponentsModule } from "../../components/components.module"
import {InviteModalModule} from "../../components/invite-modal/invite-modal.module";

@NgModule({
  declarations: [
    TaskEditPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskEditPage),
    ComponentsModule,
    InviteModalModule
  ],
  exports: [
    TaskEditPage
  ]
})
export class TaskEditPageModule {}
