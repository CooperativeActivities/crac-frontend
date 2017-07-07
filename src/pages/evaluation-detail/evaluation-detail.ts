import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';
import _ from "lodash"

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvaluationDetailPage');
  }

}
