import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ TaskDataService ],
})
export class HomePage {
  public tasks: any[];
  constructor(public navCtrl: NavController, public taskDataService: TaskDataService) { }
  ngOnInit(): void {
    this.taskDataService.getMatchingTasks().then((res) => {
      this.tasks = res.object
      console.log(this.tasks)
    }).catch((err)=>{
      console.log(err)
    })
  }


}
