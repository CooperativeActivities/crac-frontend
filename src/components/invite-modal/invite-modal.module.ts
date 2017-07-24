import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteModal } from "./invite-modal";

@NgModule({
  declarations: [
    InviteModal
  ],
  imports: [
    IonicPageModule.forChild(InviteModal),
  ],
  exports: [
    InviteModal
  ]
})
export class InviteModalModule {}
