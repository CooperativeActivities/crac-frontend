import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';

import {UserDataService} from "../../services/user_service";

@IonicPage({
  name: "competence-select-modal",
  segment: "competence-select-modal",
})
@Component({
  selector: 'modal-competence-select-modal',
  templateUrl: 'competence-select-modal.html',
  providers: [ UserDataService ],
})
export class CompetenceSelectModal {

  usedCompetences: Array<any> = [];
  allCompetenceAreas: Array<any> = [];
  competenceAreaList: Array<any> = [];
  competenceArea: any;
  competences : Array<any> = [];
  newComp: any;
  loading: Boolean = false;
  select_for: any;

  constructor(public navCtrl: NavController, public userDataService: UserDataService,
    public toast: ToastController, private viewCtrl: ViewController, public navParams: NavParams) {
    this.usedCompetences = navParams.get("usedCompetences") || [];
    this.select_for = navParams.get("select_for");
    if(!(this.select_for === "user" || this.select_for === "task")){
      console.error(`invalid parameter select_for: ${this.select_for}`)
      viewCtrl.dismiss()
      return
    }

    this.onRefresh();
  }

  async onRefresh() {
    this.resetCompetence()
    this.competenceArea = null;
    this.competences = [];

    this.loading = true
    try {
      const res = await this.userDataService.getCompetenceAreas()
      if (res.object.length === 0) {
        this.toast.create({
          message: "Keine Kompetenzbereiche gefunden: " + res.message,
          position: 'top',
          duration: 3000
        }).present();
        return;
      }

      let compAreas = res.object;
      compAreas.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      this.allCompetenceAreas = compAreas;
      this.filterAreas(null)
    } catch(error) {
      this.toast.create({
        message: "Kompetenzbereiche können nicht geladen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    }
    this.loading = false
  }

  filterAreas(ev: any) {
    const val = ev && ev.target.value;
    let list = this.allCompetenceAreas

    // Reset items back to all of the items

   *ngIf="area.mappedCompetences.length != 0"

    // set val to the value of the searchbar

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      list = list.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

    // @TODO: filter by mappedCompetences by usedCompetences here too!
    this.competenceAreaList = list.filter(area => area.mappedCompetences.length > 0)
  }

  /*
  getCompetencesForArea(newValue){
    if(newValue === null) return;
    this.competences.newObj = {
      id: -1,
      mandatory: false,
      neededProficiencyLevel: 50
    };

    this.userDataService.getCompetencesForArea(newValue)
      .then((res) => {
        if(res.object.mappedCompetences.length === 0) {
          this.toast.create({
            message: "Keine Kompetenzen in diesem Bereich gefunden",
            position: 'top',
            duration: 3000
          }).present();
          return;
        } else {
          this.competenceAreaId = newValue.id;
          // @TODO: filter meta.competences by usedCompetences!!!
          this.availableCompetences = _.orderBy(res.meta.competences, [ "name" ])
        }
      }, (error) => {
        this.toast.create({
          message: "Kompetenzen dieses Bereichs können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      });
  }
  */
  getCompetencesForArea(newValue){
    if(newValue.id === -1) return;
    this.userDataService.getCompetencesForArea(newValue.id)
      .then((res) => {
        if(res.object.mappedCompetences.length === 0) {
          this.toast.create({
            message: "Keine Kompetenzen in diesem Bereich gefunden",
            position: 'top',
            duration: 3000
          }).present();
          return;
        } else {
          this.competenceArea = newValue;
          this.competences = res.meta.competences;
        }
      }, (error) => {
        this.toast.create({
          message: "Kompetenzen dieses Bereichs können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      });
  }

  setCompetenceSelect(comp) {
    this.newComp.id = comp.id;
    this.newComp.name = comp.name;
    this.newComp.description = comp.description;
  }

  resetCompetenceArea() {
    this.competenceArea = null;
    this.resetCompetence();
  }

  resetCompetence() {
    this.newComp = {
      id: -1,
      likeValue: 50,
      proficiencyValue: 50,
      mandatory: false,
      neededProficiencyLevel: 50
    };
  }


  add(){
    this.viewCtrl.dismiss({ ...this.newComp })
  }

  cancel(){
    this.viewCtrl.dismiss()
  }
}
