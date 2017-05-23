import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: "task-edit",
})
@Component({
  selector: 'page-task-edit',
  templateUrl: 'task-edit.html',
})
export class TaskEditPage {

  public taskId : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.taskId = navParams.get("id")
    console.log(this.taskId)
  }

}
