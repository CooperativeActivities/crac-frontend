/**
 * Created by P23460 on 22.05.2017.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TaskDataService } from '../../services/task_service';

@IonicPage({
  name: "task-detail",
})
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
  providers: [ TaskDataService ],
})
export class TaskDetailPage {

  task : any;
  timeChoice = 'slot';
  taskId : number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public taskDataService: TaskDataService) {
    console.log(navParams);
    this.taskId = navParams.data.id;
  }
  ngOnInit(){
    this.doRefresh()
  }
  async doRefresh (refresher=null) {

    await Promise.all([
      this.taskDataService.getTaskById(this.taskId).then((res) => {
        this.task = res.object
        console.log(this.task);

        if(this.task.startTime != this.task.endTime ){
          this.timeChoice = 'slot';
        } else {
          this.timeChoice = 'point';
        }

      }, (error) => {
        console.warn("Task could not be retrieved", error)
      })
    ])
    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete()
    }
  }

 openMapView (){
  // Open Leaflet Map View //
   this.navCtrl.push('map-view', { id: this.taskId, address: this.task.address, lat: this.task.lat, lng: this.task.lng});
  //$state.go('tabsController.openMapView', { id: $scope.taskId, address: $scope.task.address, lat: $scope.task.lat, lng: $scope.task.lng});
}

}
