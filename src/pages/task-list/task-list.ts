import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
      this.taskDataService.getMatchingTasks(3).then((res) => {
        this.matchingTasks = res.object
      }, (error) => {
        console.warn("Matching tasks could not be retrieved", error)
      }),
      this.taskDataService.getAllParentTasks().then((res) => {
        this.parentTasks = res.object
      }, (error) => {
        console.warn("All task list could not be retrieved", error)
      })
    ])
    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }
  loadSingleTask (task) {
    if(task.taskType === "SHIFT"){
      this.navCtrl.push('task-detail', { id: task.superTask })
    } else {
      this.navCtrl.push('task-detail', { id: task.id })
    }
  }

}
