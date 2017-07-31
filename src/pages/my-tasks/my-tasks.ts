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

  allTasks: any;
  filters: any;
  participatingTasks : any[];
  followingTasks : any[];
  leadingTasks: any[];
  userHasPermissions: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public taskDataService: TaskDataService, public userDataService: UserDataService) {
    this.filters = {
      participating: 'started',
      following: 'started',
      leading: 'started'
    };
  }

  ionViewDidEnter() {
    this.doRefresh();
  }

  makeNewTask() {
    this.navCtrl.push('task-edit');
  }

  /*getOpenParticipation(t) {
    if(t.participationDetails === undefined || t.participationDetails.length === 0) return false;
    return !t.participationDetails[0].complete;
  }*/

  filterTasks(type, filter) {
    switch(filter) {
      case 'open':
        return this.allTasks[type].filter(this.getPublishedTasks);
      case 'started':
        return this.allTasks[type].filter(this.getStartedTasks);
      case 'closed':
        return this.allTasks[type].filter(this.getClosedTasks);
      default:
        return this.allTasks[type];
    }
  }
  filterParticipatingTasks(e) {
    this.participatingTasks = this.filterTasks('participating', e.value);
  }
  filterFollowingTasks(e) {
    this.followingTasks = this.filterTasks('following', e.value);
  }
  filterLeadingTasks(e) {
    this.leadingTasks = this.filterTasks('leading', e.value);
  }

  getPublishedTasks(t) {
    return t.taskState === 'PUBLISHED';
  }

  getStartedTasks(t) {
    return t.taskState === 'STARTED';
  }

  getClosedTasks(t) {
    return t.taskState === 'COMPLETED';
  }

  getOpenTasks(t) {
    return t.taskState !== 'COMPLETED';
  }

  async doRefresh (refresher=null) {
    await Promise.all([
      this.taskDataService.getMyTasks().then((res) => {
        this.allTasks = {
          participating: res.meta.participating,
          following: res.meta.following,
          leading: res.meta.leading
        };
        this.participatingTasks = _.orderBy(res.meta.participating, [ "startTime" ], [ "asc" ]).filter(this.getStartedTasks);
        this.followingTasks = _.orderBy(res.meta.following, [ "startTime" ], [ "asc" ]).filter(this.getStartedTasks);
        this.leadingTasks = _.orderBy(res.meta.leading, [ "startTime" ], [ "asc" ]).filter(this.getStartedTasks);
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
