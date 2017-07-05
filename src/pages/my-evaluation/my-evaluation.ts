import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  name: "my-evaluation",
  segment: "my-evaluation",
})
@Component({
  selector: 'page-my-evaluation',
  templateUrl: 'my-evaluation.html',
})
export class MyEvaluationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyEvaluationPage');
  }

}
