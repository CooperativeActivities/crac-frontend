import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';

@IonicPage({
  name: "evaluation-detail",
  segment: "evaluation-detail",
})
@Component({
  selector: 'page-evaluation-detail',
  templateUrl: 'evaluation-detail.html',
  providers: [ TaskDataService ]
})
export class EvaluationDetailPage {

  task: any;
  taskId: number;
  evalId: number;
  othersVal: number = 0;
  taskVal: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController,
              public taskDataService: TaskDataService) {
    this.taskId = navParams.data.taskId;
    this.evalId = navParams.data.evalId;
  }

  ionViewDidEnter(){
    this.doRefresh();
  }

  async doRefresh(refresher = null) {
    let task = await this.taskDataService.getTaskById(this.taskId)
      .catch(e => {
        console.warn("Task could not be retrieved", e)
      });
    if (task) {
      this.task = task.object;
    }
  }

  cancel(){
    this.navCtrl.pop()
  }

  toggleBinary(val) {
    if(val === 0) {
      val = 1;
    } else if(val === 1) {
      val = 0;
    }
    return val;
  }

  changeOthersVal() {
    this.othersVal = this.toggleBinary(this.othersVal);
  }
  changeTaskVal() {
    this.taskVal = this.toggleBinary(this.taskVal);
  }

  normalizeValueScale(val) {
    /*let retVal = 0;
    if(val === 4) {
      retVal = 0.5;
    } else if(val === 5) {
      retVal = 1;
    }
    return retVal;*/
    return (val === 1) ? 0.5 : 0;
  }

  submitEvaluation() {
    let vals = {
      likeValOthers: this.normalizeValueScale(this.othersVal),
      likeValTask: this.normalizeValueScale(this.taskVal)
    };

    this.taskDataService.evaluateTask(this.evalId, vals)
      .then((res) => {
        this.navCtrl.push('my-tasks');
      }, (error) => {
        this.toast.create({
          message: "Bewertung konnte nicht abgegeben werden: " + error.message,
          position: 'top',
          duration: 3000
        });
      })
  }
}
