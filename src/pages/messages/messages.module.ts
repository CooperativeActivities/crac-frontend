import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesPage } from './messages';

@NgModule({
  declarations: [
    MessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagesPage),
  ],
  exports: [
    MessagesPage
  ]
})
export class MessagesPageModule {}
