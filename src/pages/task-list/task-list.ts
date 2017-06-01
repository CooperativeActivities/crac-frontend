import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { TaskDataService } from '../../services/task_service';

@IonicPage({
  name: "task-list",
})
@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html',
  providers: [ TaskDataService ],
})
export class TaskListPage {

  parentTasks: Array<any>
  matchingTasks: Array<any>
  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService) { }
  ngOnInit(){
    this.doRefresh()
  }
  async doRefresh (refresher=null) {
    await Promise.all([
      this.taskDataService.getMatchingTasks(5).then((res) => {
        this.matchingTasks = _.orderBy(res.object, [ "assessment", "task.startTime" ], [ "desc", "asc" ])
      }, (error) => {
        console.warn("Matching tasks could not be retrieved", error)
      }),
      this.taskDataService.getAllParentTasks().then((res) => {
        this.parentTasks = _.orderBy(res.object, [ "startTime" ], [ "asc" ])
      }, (error) => {
        console.warn("All task list could not be retrieved", error)
      })
    ])
    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }
}
