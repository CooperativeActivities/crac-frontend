import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ TaskDataService ],
})
export class HomePage {

  constructor(public navCtrl: NavController, public taskDataService: TaskDataService) {
    console.log("hey! we're doing stuff")
  }
  ngOnInit(): void {
    console.log("init called")
    this.taskDataService.getMatchingTasks().then(function(res){
      this.tasks = res
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }


}
