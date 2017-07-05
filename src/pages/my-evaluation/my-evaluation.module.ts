import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyEvaluationPage } from './my-evaluation';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    MyEvaluationPage,
  ],
  imports: [
    IonicPageModule.forChild(MyEvaluationPage),
    ComponentsModule,
  ],
  exports: [
    MyEvaluationPage
  ]
})
export class MyEvaluationPageModule {}
