import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { NavController } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';

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
    this.taskDataService.getMatchingTasks().then((res) => {
      this.tasks = res.object
    }).catch((err)=>{
      console.log(err)
    })
  }


}
