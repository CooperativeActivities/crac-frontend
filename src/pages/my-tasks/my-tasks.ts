import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';
import _ from "lodash"
import {UserDataService} from "../../services/user_service";

@IonicPage({
  name: "my-tasks",
})
@Component({
  selector: 'page-my-tasks',
  templateUrl: 'my-tasks.html',
  providers: [ TaskDataService, UserDataService ],
})
export class MyTasksPage {

  participatingTasks : any[];
  followingTasks : any[];
  leadingTasks: any[];
  userHasPermissions: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public taskDataService: TaskDataService, public userDataService: UserDataService) { }

  ionViewDidEnter() {
    this.doRefresh();
  }

  makeNewTask() {
    this.navCtrl.push('task-edit');
  }

  async doRefresh (refresher=null) {
    await Promise.all([
      this.taskDataService.getMyTasks().then((res) => {
        this.participatingTasks = _.orderBy(res.meta.participating, [ "startTime" ], [ "asc" ])
        this.followingTasks = _.orderBy(res.meta.following, [ "startTime" ], [ "asc" ])
        this.leadingTasks = _.orderBy(res.meta.leading, [ "startTime" ], [ "asc" ])
      }, (error) => {
        console.warn("Matching tasks could not be retrieved", error)
      }),
      this.userDataService.getCurrentUser().then((res) => {
        let roles = res.object.roles;
        let isAdmin = roles.find((r) => {
          return r.id === 1;
        });
        this.userHasPermissions = isAdmin || false;
      }).catch((error)=>{
        console.log(error);
        console.warn("Matching tasks could not be retrieved", error)
      })
    ]);

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
