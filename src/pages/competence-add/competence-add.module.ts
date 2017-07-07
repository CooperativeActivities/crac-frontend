import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompetenceAddPage } from './competence-add';

@NgModule({
  declarations: [
    CompetenceAddPage,
  ],
  imports: [
    IonicPageModule.forChild(CompetenceAddPage),
  ],
  exports: [
    CompetenceAddPage
  ]
})
export class MyCompetencesPageModule {}
