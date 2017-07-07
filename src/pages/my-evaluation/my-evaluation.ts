import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';
import _ from "lodash"


@IonicPage({
  name: "my-evaluation",
  segment: "my-evaluation",
})
@Component({
  selector: 'page-my-evaluation',
  templateUrl: 'my-evaluation.html',
  providers: [ TaskDataService ],
})
export class MyEvaluationPage {

  openTasks : any[];

  constructor(public navCtrl: NavController, public navParams: NavParams,  public taskDataService: TaskDataService) {
  }

  ionViewDidEnter() {
    this.doRefresh();
  }

  async doRefresh (refresher=null) {
    await Promise.all([
      this.taskDataService.getTasksToEvaluate().then((res) => {
        this.openTasks = _.orderBy(res.meta.participating, [ "startTime" ], [ "asc" ])
      }, (error) => {
        console.warn("Matching tasks could not be retrieved", error)
      })
    ]);

    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }

}
