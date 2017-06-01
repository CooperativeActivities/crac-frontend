import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import * as _ from 'lodash';

import {UserDataService} from "../../services/user_service";

@IonicPage({
  name: "my-competences",
  segment: "my-competences",
})
@Component({
  selector: 'page-my-competences',
  templateUrl: 'my-competences.html',
  providers: [ UserDataService ],
})
export class MyCompetencesPage {

  competences : Array<any> = [];

  constructor(public navCtrl: NavController, public userDataService: UserDataService,
              public toast: ToastController) {
    this.onRefresh();
  }

  onRefresh() {
    let self = this;

    self.userDataService.getCompRelationships().then(function(res){
      self.competences = res.object;
      console.log(self.competences);
    }, function(error) {
      //@TODO error shows when user has no competences, should come as success
    });
  }

  remove(id){
    let self = this;

    self.userDataService.removeCompetence(id).then(function(res){
      let index = _.findIndex(self.competences, {id: id});
      self.competences.splice(index, 1)[0];
      self.toast.create({
        message: "Kompetenz gelöscht",
        position: 'top',
        duration: 3000
      }).present();
    }, function(error) {
      self.toast.create({
        message: "Kompetenz kann nicht gelöscht werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  update(c){
    let self = this;

    self.userDataService.updateCompetence(c.competence.id, c.likeValue, c.proficiencyValue).then(function(res){
      self.toast.create({
        message: "Kompetenz gespeichert",
        position: 'top',
        duration: 3000
      }).present();
    }, function(error) {
      self.toast.create({
        message: "Kompetenz kann nicht gespeichert werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  addCompetence() {
    this.navCtrl.push('competence-add');
  }
}
