/**
 * Created by P23460 on 22.05.2017.
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapViewPage } from './map-view';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
  declarations: [
    MapViewPage,
  ],
  imports: [
    IonicPageModule.forChild(MapViewPage),
    ComponentsModule,
  ],
  exports: [
    MapViewPage
  ]
})
export class MapViewPageModule {}
