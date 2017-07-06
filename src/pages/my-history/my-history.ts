import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';
import _ from "lodash"


@IonicPage({
  name: "my-history",
  segment: "my-history",
})
@Component({
  selector: 'page-my-evaluation',
  templateUrl: 'src/pages/my-history/my-history.html',
  providers: [ TaskDataService ],
})
export class MyHistoryPage {

  openTasks : any[];
  participatedTasks : any[];
  ledTasks : any[];

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
        console.warn("Open evaluations could not be retrieved: ", error);
      })
    ]);

    await Promise.all([
      this.taskDataService.getCompletedTasks('PARTICIPATING').then((res) => {
        this.participatedTasks = res.object;
      }, (error) => {
        console.warn("Participated tasks could not be retrieved: ", error);
      })
    ]);

    await Promise.all([
      this.taskDataService.getCompletedTasks('LEADING').then((res) => {
        this.ledTasks = res.object;
      }, (error) => {
        console.warn("Led tasks could not be retrieved: ", error);
      })
    ]);

    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }

}
