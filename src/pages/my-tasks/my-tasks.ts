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
      case 'unpublished':
        return this.allTasks[type].filter(this.getUnpublishedTasks);
      case 'published':
        return this.allTasks[type].filter(this.getPublishedTasks);
      case 'started':
        return this.allTasks[type].filter(this.getStartedTasks);
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

  getUnpublishedTasks(t) {
    return t.taskState === 'NOT_PUBLISHED';
  }
  getPublishedTasks(t) {
    return t.taskState === 'PUBLISHED';
  }

  getStartedTasks(t) {
    return t.taskState === 'STARTED';
  }

  async doRefresh (refresher=null) {
    await Promise.all([
      this.taskDataService.getMyTasks().then((res) => {
        this.allTasks = {
          participating: _.orderBy(res.meta.participating, ["startTime","endTime","name"], ["asc","asc","asc"]),
          following: _.orderBy(res.meta.following, ["startTime","endTime","name"], ["asc","asc","asc"]),
          leading: _.orderBy(res.meta.leading, ["startTime","endTime","name"], ["asc","asc","asc"])
        };
        this.participatingTasks = this.filterTasks('participating', this.filters.participating);
        this.followingTasks = this.filterTasks('following', this.filters.following);
        this.leadingTasks = this.filterTasks('leading', this.filters.leading);
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
