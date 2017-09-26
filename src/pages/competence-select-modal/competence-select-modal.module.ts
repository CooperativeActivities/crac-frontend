import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompetenceSelectModal } from './competence-select-modal';

@NgModule({
  declarations: [
    CompetenceSelectModal,
  ],
  imports: [
    IonicPageModule.forChild(CompetenceSelectModal),
  ],
  exports: [
    CompetenceSelectModal
  ]
})
export class CompetenceSelectModalModule {}
