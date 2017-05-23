import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { NavController } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';
import _ from "lodash"

@IonicPage({
  name: "home",
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ TaskDataService ],
})
export class HomePage {
  public tasks: any[];
  constructor(public navCtrl: NavController, public taskDataService: TaskDataService) { }
  ngOnInit(): void {
    this.taskDataService.getMatchingTasks(3).then((res) => {
      this.tasks = _.orderBy(res.object, [ "assessment", "task.startTime" ], [ "desc", "asc" ])
    }).catch((err)=>{
      console.log(err)
    })
  }
  loadSingleTask (taskId) {
    this.navCtrl.push("task-detail", { id: taskId })
  }

}
