import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EvaluationDetailPage } from './evaluation-detail';

@NgModule({
  declarations: [
    EvaluationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EvaluationDetailPage),
  ],
  exports: [
    EvaluationDetailPage
  ]
})
export class EvaluationDetailPageModule {}
