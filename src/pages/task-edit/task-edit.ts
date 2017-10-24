import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController } from 'ionic-angular';
import * as _ from 'lodash';

import { TaskDataService } from '../../services/task_service';
import { UserDataService } from "../../services/user_service";

@IonicPage({
  name: "task-edit",
})
@Component({
  selector: 'page-task-edit',
  templateUrl: 'task-edit.html',
  providers: [ TaskDataService, UserDataService ],
})
export class TaskEditPage {

  public taskId : any;
  public parentId : any;
  parentTask: any;
  task : any = {};
  hasStartTime: boolean = false;
  hasEndTime: boolean = false;
  isNewTask: boolean = true;
  isChildTask: boolean = false;
  addNewShift: boolean = false;
  addNewMaterial: boolean = false;
  pageTitle: string;
  materials: any = {
    newObj: {
      quantity: 1,
    },
    toAdd: [],
    toRemove: [],
    toUpdate: [],
    all: []
  };
  shifts:any = {
    newObj: {},
    toAdd: [],
    toRemove: [],
    all: []
  };
  competences: any = {
    toAdd: [],
    toRemove: [],
    toUpdate: [],
    all: []
  };
  showDelete: boolean = false;
  showPublish: boolean = false;
  showUnpublish: boolean = false;
  minimumDate: string;
  maximumDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController, public alert: AlertController,
              public taskDataService: TaskDataService, public userDataService: UserDataService, public modalCtrl: ModalController) {
    this.taskId = navParams.get("id");
    this.parentId = navParams.get("parentId");

    let now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    this.minimumDate = this.getDateString(now);

    now.setFullYear(now.getFullYear() + 4);
    this.maximumDate = this.getDateString(now);

    if(this.taskId !== undefined) {
      this.pageTitle = 'Aufgabe Bearbeiten';
      this.isNewTask = false;
      this.doRefresh();
    } else {
      this.isNewTask = true;
      this.task = {
        taskType: 'ORGANISATIONAL',
        taskCompetences: [],
        childTasks: [],
        materials: []
      };

      if (this.parentId) {
        this.isChildTask = true;
        this.pageTitle = "Unteraufgabe Erstellen";
        this.getParent();
      } else {
        this.isChildTask = false;
        this.pageTitle = "Aufgabe Erstellen";

        this.task.startTime = this.minimumDate;
      }
    }
  }
// Check if Address field has been updated on Map Page
  ionViewDidEnter(){
    console.log(this.navParams)
    if (this.navParams.data.address != null) {
      this.task.address = this.navParams.data.address;
      this.task.geoLat = this.navParams.data.lat;
      this.task.geoLng = this.navParams.data.lng;
      console.log("Import Address: " + this.navParams.data.address + " | lat: " + this.navParams.data.lat + " / lng: " + this.navParams.data.lng);
    }
  }
  cancel(){
    this.navCtrl.pop()
  }

  getDateString(d){
    let tzo = -d.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = (num) => {
        let norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return d.getFullYear() +
      '-' + pad(d.getMonth() + 1) +
      '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) +
      ':' + pad(d.getMinutes()) +
      ':' + pad(d.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }

  getParent(){
    this.taskDataService.getTaskById(this.parentId).then(res => {
      this.parentTask = res.object;
      this.task.startTime = this.getDateString(new Date( this.parentTask.startTime));
      this.task.endTime = this.getDateString(new Date (this.parentTask.endTime));
    },(error) => {
      console.warn('Parent task could not be retrieved: ', error);
    });

  }

  updateFlags(){
    let task = this.task;

    //initialize all flags to false
    this.showPublish =false;
    this.showUnpublish = false;
    this.showDelete = false;

    switch(task.taskState){
      case "COMPLETED":
        //disable all fields
        break;
      case "STARTED":
        this.showUnpublish = true;
        this.showDelete = true;
        break;
      case "PUBLISHED":
        this.showUnpublish = true;
        this.showDelete = true;
        break;
      case "NOT_PUBLISHED":
        this.showPublish = this.task.superTask === null;
        this.showDelete = true;
        break;
    }
  };

  openMap() {
    this.navCtrl.push('map-select',
      {
       id: this.taskId,
       address: this.task.address,
       lat: this.task.geoLat,
       lng: this.task.geoLng
     });
  }

  toTimestamp(datestring): Number {
    if(!datestring) return
    if(!isNaN(datestring)) return datestring;
    let date = Date.parse(datestring)
    if(isNaN(date)) return
    return date
  }

  setTimeToZero(d) {
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  }

  addStartTime() {
    this.hasStartTime = true;
    let d = this.setTimeToZero(new Date(this.task.startTime));
    this.task.startTime = this.getDateString(d);
  }

  addEndTime() {
    this.hasEndTime = true;
    if(!this.task.endTime) return;
    let d = this.setTimeToZero(new Date(this.task.endTime));
    this.task.endTime = this.getDateString(d);
  }

  areLawsOfTimeFollowed(start, end) {
    if(!end || start <= end) {
      return true;
    }
    return false;
  }

  getProcessedTaskData() {
    let taskData : any = {};
    taskData.name = this.task.name;

    let startTime = this.toTimestamp(this.task.startTime);
    let endTime = this.toTimestamp(this.task.endTime);

    if(!startTime){
      this.toast.create({
        message: "Aufgabe kann nicht gespeichert werden: " + "Bitte ein gültiges Startdatum eingeben!",
        duration: 3000,
        position: 'top'
      }).present();
      return;
    }
    if(!endTime){
      endTime = startTime
    }
    if(!this.areLawsOfTimeFollowed(startTime, endTime)){
      this.toast.create({
        message: "Aufgabe kann nicht gespeichert werden: " + "Startdatum muss vor Enddatum liegen!",
        duration: 3000,
        position: 'top'
      }).present();
      return;
    }


    taskData.startTime = startTime;
    taskData.endTime = endTime;

    if(this.task.description) taskData.description = this.task.description;
    if(this.task.location) taskData.location = this.task.location;
    if(this.task.address) taskData.address = this.task.address;
    if(this.task.geoLat) taskData.geoLat = this.task.geoLat;
    if(this.task.geoLng) taskData.geoLng = this.task.geoLng;
    if(this.task.minAmountOfVolunteers) taskData.minAmountOfVolunteers = this.task.minAmountOfVolunteers;
    taskData.taskType = this.task.taskType;
    taskData.taskState = this.task.taskState;

    return taskData;
  }


  save_changes() {
    this.save_task().then((success) => {
      if(!success){ return }
      if(this.isNewTask) {
        this.toast.create({
          message: "Aufgabe erstellt",
          duration: 3000,
          position: 'top'
        }).present();

        const id = this.task.id
        this.navCtrl.setPages(
          this.navCtrl.getViews()
          // remove last element
          .slice(0, -1)
          .map(view => ({ page: view.id, params: view.data }))
          .concat({ page: "task-detail", params: { id } })

        )
        //this.navCtrl.push('task-detail', {id: this.task.id});
      } else {
        this.toast.create({
          message: "Aufgabe gespeichert",
          duration: 3000,
          position: 'top'
        }).present();

        this.navCtrl.pop()
      }
    })
  };

  async save_task(): Promise<boolean> {
    if(!this.task.name){
      this.toast.create({
        message: "Aufgabe kann nicht gespeichert werden: " + "Name muss angegeben werden",
        duration: 3000,
        position: 'top'
      }).present();
      return false
    }
    try {
      const taskData = this.getProcessedTaskData();
      if(!taskData) return
      let res
      if(this.isNewTask) {
        if (!this.parentTask) {
          res = await this.taskDataService.createNewTask(taskData)
        } else {
          res = await this.taskDataService.createNewSubTask(taskData, this.parentTask.id)
        }
      } else {
        res = await this.taskDataService.updateTaskById(taskData, this.task.id)
      }
      let task = res.object
      this.task = task;
      await this.save_details(task)
      return true
    } catch(error) {
      this.toast.create({
        message: "Aufgabe kann nicht gespeichert werden: " + error.message,
        duration: 3000,
        position: 'top'
      }).present();
      return false
    }
  }

  save_details(task) {
    let promises = [];

    let competencesToAdd = this.competences.toAdd.map((competence) => {
      return {
        competenceId: competence.id,
        importanceLevel: competence.neededProficiencyLevel || 0,
        neededProficiencyLevel: competence.neededProficiencyLevel || 0,
        mandatory: competence.mandatory ? 1 : 0
      }
    });
    let competencesToUpdate = this.competences.toUpdate.map((competence) => {
      return {
        id: competence.id,
        importanceLevel: parseInt(competence.neededProficiencyLevel) || 0,
        neededProficiencyLevel: parseInt(competence.neededProficiencyLevel) || 0,
        mandatory: competence.mandatory ? 1 : 0
      }
    });
    let shiftsToAdd = (this.shifts.toAdd).map(shift => {
      return {
        taskType: 'SHIFT',
        name: task.name,
        minAmountOfVolunteers: shift.minAmountOfVolunteers,
        // startTime & endTime have to be timestamps ( => Number)
        startTime: shift.startTime,
        endTime: shift.endTime
      }
    });
    let materialsToAdd = (this.materials.toAdd).map((material) => {
      return {
        name: material.name,
        description: material.description || "",
        quantity: material.quantity || 0
      }
    });
    let materialsToUpdate = this.materials.toUpdate.map((material) => {
      return {
        id: material.id,
        name: material.name,
        description: material.description || "",
        quantity: material.quantity || 0
      }
    });

    if(competencesToAdd.length > 0 ) {
      promises.push(this.taskDataService.addCompetencesToTask(task.id, competencesToAdd));
    }
    for(let c of competencesToUpdate) {
      promises.push(this.taskDataService.updateTaskCompetence(task.id, c));
    }
    for(let c of this.competences.toRemove) {
      promises.push(this.taskDataService.removeCompetenceFromTask(task.id, c));
    }
    for(let s of shiftsToAdd) {
      promises.push(this.taskDataService.createNewSubTask(s, task.id));
    }
    for(let s of this.shifts.toRemove) {
      promises.push(this.taskDataService.deleteTaskById(s));
    }
    if(materialsToAdd.length > 0 ) {
      promises.push(this.taskDataService.addMaterialsToTask(task.id, materialsToAdd));
    }
    for(let m of materialsToUpdate) {
      promises.push(this.taskDataService.updateMaterial(task.id, m));
    }
    for(let m of this.materials.toRemove) {
      promises.push(this.taskDataService.removeMaterialFromTask(task.id, m));
    }

    return Promise.all(promises);
  }

  task_delete(){
    let template = 'Wollen sie diese Aufgabe wirklich löschen? Es wird die Aufgabe mit ALLEN darunterliegenden Aufgaben permanent gelöscht.';
    if( this.task.taskState === 'PUBLISHED' )
      template += "<p><strong>Aufgabe ist schon veröffentlicht. Aufgabe trotzdem löschen?</strong></p>";
    if( this.task.taskState === 'STARTED' )
      template += "<p><strong>Aufgabe ist schon gestartet. Aufgabe trotzdem löschen?</strong></p>";

    this.alert.create({
      title: 'Löschen',
      message: template,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: () => {
            this.taskDataService.deleteTaskById(this.task.id).then((res) => {
              this.toast.create({
                message: "Aufgabe gelöscht",
                position: 'top',
                duration: 3000
              }).present();
              if (this.task.superTask) {
                const id = this.task.id
                this.navCtrl.setPages(
                  this.navCtrl.getViews()
                  .filter(view => view && ((view.id !== "task-detail" && view.id !== "task-edit") || (view.data && view.data.id !== id)))
                  .map(view => ({ page: view.id, params: view.data }))
                )
              } else {
                this.navCtrl.popToRoot();
              }
            }, (error) => {
              this.toast.create({
                message: "Aufgabe kann nicht gelöscht werden: " + error.message,
                position: 'top',
                duration: 3000
              }).present();
            });
          }
        }
      ]
    }).present();
  };

  async publish() {
    if(this.task.taskType === 'ORGANISATIONAL'){
      if(this.task.childTasks.length <= 0){
        let message = "Übersicht hat noch keine Unteraufgabe! Bitte füge eine Unteraufgabe hinzu!";
        this.toast.create({
          message: "Task kann nicht veröffentlicht werden: " + message,
          position: 'top',
          duration: 3000
        }).present();
        return;
      }
    }
    let success = await this.save_task()
    if(!success){ return }
    this.taskDataService.changeTaskState(this.task.id, 'PUBLISHED').then((res) => {
      this.task.taskState = 'PUBLISHED';
      this.updateFlags();
      this.toast.create({
        message: "Aufgabe veröffentlicht",
        position: 'top',
        duration: 3000
      }).present();
    }, (error) => {
      this.toast.create({
        message: "Aufgabe kann nicht veröffentlicht werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  };

  async unpublish() {
    let success = await this.save_task()
    if(!success){ return }
    this.taskDataService.forceTaskState(this.task.id, 'unpublish').then((res) => {
      this.task.taskState = 'NOT_PUBLISHED';
      this.updateFlags();
      this.toast.create({
        message: "Aufgabe zurückgezogen",
        position: 'top',
        duration: 3000
      }).present();
      this.navCtrl.pop()
    }, (error) => {
      this.toast.create({
        message: "Aufgabe kann nicht zurückgezogen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  };

  addCompetence(){
    const modal = this.modalCtrl.create("competence-select-modal", { usedCompetences: this.competences.all.map(c => c.id), select_for: "task" })

    modal.onDidDismiss((newComp: any) => {
      if(newComp){
        this.competences.toAdd.push(newComp);
        this.competences.all.push(newComp);
      }
    })
    modal.present()
  }

  updateCompetence(competence){
    if(!competence) return;
    let index = _.findIndex(this.competences.toUpdate, {id: competence.id});
    if(index < 0) {
      this.competences.toUpdate.push(competence);
    } else {
      this.competences.toUpdate[index] = competence;
    }
  };

  removeCompetence(competence){
    if(!competence) return;
    let index = _.findIndex(this.competences.all, competence);
    this.competences.all.splice(index, 1)[0];
    let newIndex = _.findIndex(this.competences.toAdd, competence);
    if(newIndex < 0) {
      this.competences.toRemove.push(competence.id);
    } else {
      this.competences.toAdd.splice(newIndex, 1)[0];
    }
  };

  openNewShiftForm(){
    let start = this.task.startTime;
    let end = this.task.endTime || this.task.startTime;
    this.shifts.newObj.startTime = start;
    this.shifts.newObj.endTime = end;
    this.shifts.newObj.minAmountOfVolunteers = 1;
    this.addNewShift = !this.addNewShift;
  }

  addShift() {
    if(!this.shifts.newObj.minAmountOfVolunteers){
      let message = 'Bitte geben Sie die Anzahl an Helfer an!';
      this.toast.create({
        message: "Schicht konnte nicht hinzugefügt werden: " + message,
        position: 'top',
        duration: 3000
      }).present();
      return;
    }

    let startTime = this.toTimestamp(this.shifts.newObj.startTime);
    let endTime = this.toTimestamp(this.shifts.newObj.endTime);
    if(!(startTime && endTime && startTime < endTime)){
      let message = 'Start- und Endzeit müssen gültig sein!';
      this.toast.create({
        message: "Schicht konnte nicht hinzugefügt werden: " + message,
        position: 'top',
        duration: 3000
      }).present();
      return;
    }
    let newShift = _.clone(this.shifts.newObj);
    newShift.startTime = startTime
    newShift.endTime = endTime
    this.shifts.all.push(newShift);
    this.shifts.toAdd.push(newShift);

    this.closeAddShift();
  };

  closeAddShift() {
    this.shifts.newObj = {};
    this.addNewShift = false;
  }

  removeShift(shift) {
    if (!shift) return;
    let index = _.findIndex(this.shifts.all, shift);
    let newIndex = _.findIndex(this.shifts.toAdd, shift);
    this.shifts.all.splice(index, 1)[0];
    if (newIndex < 0) {
      this.shifts.toRemove.push(shift.id);
    } else {
      this.shifts.toAdd.splice(newIndex, 1)[0];
    }
  }

  validateMaterial(material) {
    if (!material.name || !material.quantity) {
      let message = "Bitte geben Sie ";
      if (!material.name) {
        message += "den Namen ";
      }
      if (!material.quantity) {
        if (!material.name) {
          message += "und ";
        }
        message += "die Menge";
      }
      message += " an!";
      this.toast.create({
        message: message,
        position: 'top',
        duration: 3000
      }).present();
      return false;
    }

    return true;
  }

  addMaterial(){
    if(!this.validateMaterial(this.materials.newObj)) {
      return false;
    }

    //save later
    let newMaterial = _.clone(this.materials.newObj);
    newMaterial.quantity = newMaterial.quantity || 1;
    this.materials.all.push(newMaterial);
    this.materials.toAdd.push(newMaterial);

    this.closeAddMaterial();
  };

  closeAddMaterial() {
    this.materials.newObj = {
      quantity: 1,
    };
    this.addNewMaterial = false;
  }

  updateMaterial(material){
    if(!this.validateMaterial(material)) {
      return false;
    }

    //save later
    this.materials.toUpdate.push(material);
  };

  removeMaterial(material){
    if(!material) return;
    let index = _.findIndex(this.materials.all, material);
    let newIndex = _.findIndex(this.materials.toAdd, material);
    this.materials.all.splice(index, 1)[0];
    if(newIndex < 0) {
      this.materials.toRemove.push(material.id);
    } else {
      this.materials.toAdd.splice(newIndex, 1)[0];
    }
  };


  async doRefresh (refresher=null) {
    await this.taskDataService.getTaskById(this.taskId).then(async (res) => {
      this.task = res.object;

      this.updateFlags();

      this.hasStartTime = true;
      if(this.task.startTime === this.task.endTime) {
        this.task.endTime = null;
      } else {
        this.task.endTime = this.getDateString(new Date(this.task.endTime));
        this.hasEndTime = true;
      }
      this.task.startTime = this.getDateString(new Date(this.task.startTime));

      if(this.task.taskType === "WORKABLE"){
        const shifts = (await Promise.all(this.task.childTasks.map(({ id }) => this.taskDataService.getTaskById(id)))).map((res: any) => res.object)
        this.shifts.all = _.orderBy(shifts, [ "startTime" ])
        this.competences.all = _.orderBy(_.clone(this.task.taskCompetences), [ "name" ])
        this.materials.all = _.orderBy(_.clone(this.task.materials), [ "name" ])

        for(const shift of this.shifts.all) {
          shift.startTime = this.getDateString(new Date(shift.startTime));
          shift.endTime = this.getDateString(new Date(shift.endTime));
        }
      }

    }, (error) => {
      this.showToast({ message:"Aufgabe kann nicht geladen werden: " + error.message, })
    })
    //Stop the ion-refresher from spinning
    if(refresher){
      refresher.complete();
    }
  }

  showToast({ message, position="top", duration=3000 }){
    this.toast.create({ message, position, duration, })
      .present();
  }


}
