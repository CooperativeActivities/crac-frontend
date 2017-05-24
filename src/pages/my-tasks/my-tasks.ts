import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';

@IonicPage({
  name: "my-tasks",
})
@Component({
  selector: 'page-my-tasks',
  templateUrl: 'my-tasks.html',
  providers: [ TaskDataService ],
})
export class MyTasksPage {

  participatingTasks : any[]
  followingTasks : any[]
  leadingTasks: any[]

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService) { }


  ngOnInit(){
    this.doRefresh()
  }

  async doRefresh (refresher=null) {
    await Promise.all([
      this.taskDataService.getMyTasks().then((res) => {
        console.log(res);
        this.participatingTasks = res.meta.participating;
        this.followingTasks = res.meta.following;
        this.leadingTasks = res.meta.leading;
      }, (error) => {
        console.warn("Matching tasks could not be retrieved", error)
      })
    ])

    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTasksPage');
  }
  /*$scope.makeNewTask= function(){
    $state.go('tabsController.newTask');
  };*/
}
