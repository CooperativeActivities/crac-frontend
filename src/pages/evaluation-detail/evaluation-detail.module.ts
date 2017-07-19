import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EvaluationDetailPage } from './evaluation-detail';
import {Ionic2RatingModule} from "ionic2-rating";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    EvaluationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EvaluationDetailPage),
    ComponentsModule,
    Ionic2RatingModule
  ],
  exports: [
    EvaluationDetailPage
  ]
})
export class EvaluationDetailPageModule {}
