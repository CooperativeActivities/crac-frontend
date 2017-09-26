import { NgModule } from '@angular/core';
import { TaskPreviewComponent } from './task-preview/task-preview';
import { TaskPreviewRecursiveComponent } from './task-preview-recursive/task-preview-recursive';
import { CollapsibleCardComponent } from './collapsible-card/collapsible-card';
import { CollapsibleCardToggleableComponent } from './collapsible-card/collapsible-card-toggleable';
import { IonicModule } from "ionic-angular"

@NgModule({
  declarations: [
    TaskPreviewComponent,
    TaskPreviewRecursiveComponent,
    CollapsibleCardComponent,
    CollapsibleCardToggleableComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TaskPreviewComponent,
    TaskPreviewRecursiveComponent,
    CollapsibleCardComponent,
    CollapsibleCardToggleableComponent,
  ]
})
export class ComponentsModule {}
