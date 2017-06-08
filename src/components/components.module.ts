import { NgModule } from '@angular/core';
import { TaskPreviewComponent } from './task-preview/task-preview';
import { TaskPreviewRecursiveComponent } from './task-preview-recursive/task-preview-recursive';
import { CollapsibleCardComponent } from './collapsible-card/collapsible-card';
import { IonicModule } from "ionic-angular"

@NgModule({
  declarations: [
    TaskPreviewComponent,
    TaskPreviewRecursiveComponent,
    CollapsibleCardComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TaskPreviewComponent,
    TaskPreviewRecursiveComponent,
    CollapsibleCardComponent,
  ]
})
export class ComponentsModule {}
