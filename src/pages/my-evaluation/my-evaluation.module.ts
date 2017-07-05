import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyEvaluationPage } from './my-evaluation';

@NgModule({
  declarations: [
    MyEvaluationPage,
  ],
  imports: [
    IonicPageModule.forChild(MyEvaluationPage),
  ],
  exports: [
    MyEvaluationPage
  ]
})
export class MyEvaluationPageModule {}
