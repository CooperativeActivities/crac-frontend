import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCompetencesPage } from './my-competences';

@NgModule({
  declarations: [
    MyCompetencesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCompetencesPage),
  ],
  exports: [
    MyCompetencesPage
  ]
})
export class MyCompetencesPageModule {}
