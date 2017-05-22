import { NgModule } from '@angular/core';
import { TaskPreviewComponent } from './task-preview/task-preview';
import { IonicModule } from "ionic-angular"

@NgModule({
  declarations: [
    TaskPreviewComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TaskPreviewComponent
  ]
})
export class ComponentsModule {}
