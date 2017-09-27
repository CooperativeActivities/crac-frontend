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
  confirmed_leave = false;

  constructor(public navCtrl: NavController, public userDataService: UserDataService,
    public toast: ToastController, private viewCtrl: ViewController, public navParams: NavParams) {
    this.usedCompetences = navParams.get("usedCompetences") || [];
    console.log(this.usedCompetences)
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

    if (val && val.trim() != '') {
      list = list.filter(item => (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) )
    }

    // only include areas that contain unused competences
    this.competenceAreaList = list.filter(area =>
      area.mappedCompetences.filter(compId => this.usedCompetences.indexOf(compId) < 0).length > 0
    )
  }

  async getCompetencesForArea(newValue){
    if(!(newValue && newValue.id >= 0)) return;
    let res
    try {
      res = await this.userDataService.getCompetencesForArea(newValue.id)
    } catch (error){
      this.showToast({ message: "Kompetenzen dieses Bereichs können nicht geladen werden: " + error.message, })
      return
    }

    // only show unused competences
    this.competences = res.meta.competences.filter(comp => this.usedCompetences.indexOf(comp.id) < 0)
    this.competenceArea = newValue;
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
      name: "",
      description: "",
      likeValue: 50,
      proficiencyValue: 50,
      mandatory: false,
      neededProficiencyLevel: 50
    };
  }
  tryLeaving(){
    if(this.newComp.id >= 0){
      this.resetCompetence()
      return false
    }
    if(this.competenceArea){
      this.resetCompetenceArea()
      return false
    }
    return true
  }

  ionViewCanLeave() {
    return this.confirmed_leave || this.tryLeaving()
  }

  add(){
    this.confirmed_leave = true
    this.viewCtrl.dismiss({ ...this.newComp })
  }

  cancel(){
    this.viewCtrl.dismiss()
  }

  showToast({ message, position="top", duration=3000 }){
    this.toast.create({ message, position, duration, })
      .present();
  }
}
