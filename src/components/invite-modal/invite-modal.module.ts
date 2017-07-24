import { NgModule } from '@angular/core';
import {IonicModule} from "ionic-angular";
import { InviteGroups } from "./invite-groups";
import {InvitePeople} from "./invite-people";

@NgModule({
  declarations: [
    InviteGroups,
    InvitePeople
  ],
  imports: [
    IonicModule
  ],
  exports: [
    InviteGroups,
    InvitePeople
  ]
})
export class InviteModalModule {}
