import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaskDataService } from '../../services/task_service';

@Component({
  selector: 'task-preview',
  templateUrl: 'task-preview.html',
  providers: [ TaskDataService ],
})
export class TaskPreviewComponent implements OnInit {
  @Input() task: any;
  @Input() clickData: any;
  @Input() action: any;
  @Input() showAllIcons: Boolean;
  @Input() headerClick: Function;
  showFollow : Boolean = false;
  showUnfollow : Boolean = false;
  isSingleDate : Boolean;
  isSingleTime : Boolean;

  constructor(public navCtrl: NavController, public taskDataService: TaskDataService) { }

  ngOnInit(){
    if (this.action === "follow") {
      this.showFollow = true
    } else if (this.action === "unfollow") {
      this.showUnfollow = true
    }
    let startDate = new Date(this.task.startTime)
    let endDate = new Date(this.task.endTime)
    this.isSingleDate = (startDate.getDate() == endDate.getDate()) &&
      (startDate.getFullYear() == endDate.getFullYear()) &&
      (startDate.getMonth() == endDate.getMonth())
    this.isSingleTime = this.task.startTime === this.task.endTime
    /*
    TaskDataService.getTaskRelatById(scope.task.id).then(function(res){
      return res.meta.relationship.participationType;
    },function(error){
      //@TODO this is not ideal, NOT_PARTICIPATING should be handled in success and this should have a warn
      return "NOT_PARTICIPATING";
    }).then(function(relation){
      scope.participationType = relation;
    });
     */
  }

  follow(id) {
    this.taskDataService.changeTaskPartState(this.task.id, 'follow').then(res => {
      this.showFollow = false
      this.showUnfollow = true
      console.log("Following task");
    }, error => {
      console.log("Following task error", error);
      //ionicToast.show("Aufgabe kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
    })
  }

  unfollow(id){
    this.taskDataService.removeOpenTask(this.task.id).then(res => {
      this.showFollow = true
      this.showUnfollow = false
      console.log("Unfollowed task");
    }, error => {
      console.log("Unfollowing task error", error);
      //ionicToast.show("Aufgabe kann nicht gefolgt werden: " + error.message, 'top', false, 5000);
    })
  }

  privateHeaderClick(event){
    if(this.headerClick){
      let stopPropagation = this.headerClick();
      if(stopPropagation) event.stopPropagation();
    }
  }

  clickItem() {
    if(this.clickData !== undefined) {
      this.navCtrl.push(this.clickData.loc, this.clickData.params);
    } else {
      this.navCtrl.push( 'task-detail', this.getTaskRedirectParams());
    }
  }

  getTaskRedirectParams() {
    if(this.task.taskType === "SHIFT") {
      return {id: this.task.superTask};
    }

    return { id: this.task.id }
  }
}

