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

  constructor(public navCtrl: NavController, public userDataService: UserDataService,
              public toast: ToastController) {
    this.onRefresh();
    this.getCompetenceAreas();
  }

  onRefresh() {
    let self = this;

    self.newComp = {
      id: -1,
      likeValue: 50,
      proficiencyValue: 50
    };
    self.competenceArea = null;
    self.competences = [];
  }

  getCompetenceAreas() {
    let self = this;
    self.userDataService.getCompetenceAreas()
    .then(function (res) {
      if (res.object.length === 0) {
        self.toast.create({
          message: "Keine Kompetenzbereiche gefunden: " + res.message,
          position: 'top',
          duration: 3000
        }).present();
        return;
      }

      let compAreas = res.object;
      compAreas.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      self.allCompetenceAreas = compAreas;
      self.competenceAreaList = compAreas;
    }, function (error) {
      self.toast.create({
        message: "Kompetenzbereiche können nicht geladen werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  filterAreas(ev: any) {
    let self = this;

    // Reset items back to all of the items
    self.competenceAreaList = self.allCompetenceAreas;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      self.competenceAreaList = self.competenceAreaList.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  getCompetencesForArea(newValue){
    let self = this;

    if(newValue.id === -1) return;
    self.userDataService.getCompetencesForArea(newValue.id)
      .then(function(res) {
        if(res.object.mappedCompetences.length === 0) {
          self.toast.create({
            message: "Keine Kompetenzen in diesem Bereich gefunden",
            position: 'top',
            duration: 3000
          }).present();
          return;
        } else {
          self.competenceArea = newValue;
          self.competences = res.meta.competences;
        }
      }, function(error) {
        self.toast.create({
          message: "Kompetenzen dieses Bereichs können nicht geladen werden: " + error.message,
          position: 'top',
          duration: 3000
        }).present();
      });
  }

  setCompetenceSelect(comp) {
    let self = this;

    self.newComp.id = comp.id;
    self.newComp.name = comp.name;
    self.newComp.description = comp.description;
  }

  resetCompetenceArea() {
    let self = this;

    self.competenceArea = null;
    self.resetCompetence();
  }

  resetCompetence() {
    let self = this;

    self.newComp = {
      id: -1,
      likeValue: 50,
      proficiencyValue: 50
    };
  }


  add(){
    let self = this;

    self.userDataService.addLikeProfValue(self.newComp.id, self.newComp.likeValue, self.newComp.proficiencyValue).then(function(res){
      self.toast.create({
        message: "Kompetenz hinzufügt",
        position: 'top',
        duration: 3000
      }).present();
      self.newComp = {
        id: -1,
        likeValue: 50,
        proficiencyValue: 50
      };
      self.competenceArea = null;
    }, function(error) {
      self.toast.create({
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
