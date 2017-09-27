import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterAddPage } from './filter-add';
import { ComponentsModule } from "../../components/components.module"

@NgModule({
    declarations: [
       FilterAddPage,
    ],
    imports: [
        IonicPageModule.forChild(FilterAddPage),
        ComponentsModule,
    ],
    exports: [
        FilterAddPage
    ]
})
export class FilterAddPageModule {}
