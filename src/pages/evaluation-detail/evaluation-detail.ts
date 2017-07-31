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
  taskVal: number = 3;

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

  changeOthersVal() {
    this.othersVal = this.toggleBinary(this.othersVal);
  }

  toggleBinary(val) {
    if(val === 0) {
      val = 1;
    } else if(val === 1) {
      val = 0;
    }
    return val;
  }

  getFiveStarValue(val) {
    if(val === 0) return 0;
    return (val - 3) / 2;
  }

  getBinaryVal(val) {
    return (val === 1) ? 0.5 : 0;
  }

  submitEvaluation() {
    let vals = {
      likeValOthers: this.getBinaryVal(this.othersVal),
      likeValTask: this.getFiveStarValue(this.taskVal)
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
