import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';

import {UserDataService} from "../../services/user_service";

@IonicPage({
  name: "competence-add",
  segment: "competence-add",
})
@Component({
  selector: 'page-competence-add',
  templateUrl: 'competence-add.html',
  providers: [ UserDataService ],
})
export class CompetenceAddPage {

  allCompetenceAreas: Array<any> = [];
  competenceAreaList: Array<any> = [];
  competenceArea: any;
  competences : Array<any> = [];
  newComp: any;
  loading: Boolean = false;

  constructor(public navCtrl: NavController, public userDataService: UserDataService,
    public toast: ToastController) {
    this.onRefresh();
  }

  async onRefresh() {
    this.newComp = {
      id: -1,
      likeValue: 50,
      proficiencyValue: 50
    };
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
      this.competenceAreaList = compAreas;
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

    // Reset items back to all of the items
    this.competenceAreaList = this.allCompetenceAreas;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.competenceAreaList = this.competenceAreaList.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

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
      proficiencyValue: 50
    };
  }


  add(){
    this.userDataService.addLikeProfValue(this.newComp.id, this.newComp.likeValue, this.newComp.proficiencyValue).then((res) => {
      this.toast.create({
        message: "Kompetenz hinzufügt",
        position: 'top',
        duration: 3000
      }).present();
      this.newComp = {
        id: -1,
        likeValue: 50,
        proficiencyValue: 50
      };
      this.navCtrl.pop()

      this.competenceArea = null;
    }, (error) => {
      this.toast.create({
        message: "Kompetenz kann nicht hinzufügt werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  cancel(){
    this.navCtrl.pop()
  }

  addCompetence() {
    this.navCtrl.push('competence-add');
  }
}
