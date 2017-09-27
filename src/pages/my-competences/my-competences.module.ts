import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCompetencesPage } from './my-competences';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    MyCompetencesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCompetencesPage),
    ComponentsModule,
  ],
  exports: [
    MyCompetencesPage
  ]
})
export class MyCompetencesPageModule {}
