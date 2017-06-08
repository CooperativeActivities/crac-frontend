import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';
import _ from "lodash"

@Component({
  selector: 'task-preview-recursive',
  templateUrl: 'task-preview-recursive.html',
  providers: [ TaskDataService ],
})
export class TaskPreviewRecursiveComponent implements OnInit {
  @Input() task: any
  childrenVisible = false
  showChildren = false
  childTasks: any[]

  constructor(public navCtrl: NavController, public taskDataService: TaskDataService) { }

  ngOnInit(){
    this.showChildren =
      this.task.childTasks
      && this.task.childTasks.length > 0
      // do not show shifts
      && this.task.taskType === "ORGANISATIONAL"
    if(this.showChildren){
      this.childTasks = _.orderBy(this.task.childTasks, [ "startTime", "name" ])
    }
  }
  taskPreviewHeaderClick(){
    this.childrenVisible = !this.childrenVisible
    return true;
  }

}

