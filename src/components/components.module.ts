import { NgModule } from '@angular/core';
import { TaskPreviewComponent } from './task-preview/task-preview';
import { CollapsibleCardComponent } from './collapsible-card/collapsible-card';
import { IonicModule } from "ionic-angular"

@NgModule({
  declarations: [
    TaskPreviewComponent,
    CollapsibleCardComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TaskPreviewComponent,
    CollapsibleCardComponent,
  ]
})
export class ComponentsModule {}
