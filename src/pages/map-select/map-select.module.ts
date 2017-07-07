import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapSelectPage } from './map-select';

@NgModule({
  declarations: [
    MapSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(MapSelectPage),
  ],
  exports: [
    MapSelectPage
  ]
})
export class MapSelectPageModule {}
