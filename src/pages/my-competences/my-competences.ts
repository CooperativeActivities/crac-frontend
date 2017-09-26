import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, ToastController} from 'ionic-angular';
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

  constructor(public modalCtrl: ModalController, public userDataService: UserDataService,
              public toast: ToastController, public alert: AlertController) {
  }

  ionViewDidEnter() {
    this.onRefresh();
  }

  onRefresh() {
    this.userDataService.userCompetences().then((res) => {
      this.competences = _.sortBy(res.object, "competence.name");
      console.log(this.competences);
    }, (error) => {
      //@TODO error shows when user has no competences, should come as success
    });
  }

  remove(id){
    let self = this;

    self.alert.create({
      title: 'Löschen',
      message: 'Wollen Sie diese Kompetenz wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: () => {
            self.userDataService.removeCompetence(id).then(function(res){
              let index = _.findIndex(self.competences, {competence: {id: id}});
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
        }
      ]
    }).present();
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
    const modal = this.modalCtrl.create("competence-select-modal", { select_for: "user" })

    modal.onDidDismiss((newComp: any) => {
      if(newComp){
        this.userDataService.addLikeProfValue(newComp.id, newComp.likeValue, newComp.proficiencyValue).then((res) => {
          this.toast.create({
            message: "Kompetenz hinzufügt",
            position: 'top',
            duration: 3000
          }).present();
          this.onRefresh()
        }, (error) => {
          this.toast.create({
            message: "Kompetenz kann nicht hinzufügt werden: " + error.message,
            position: 'top',
            duration: 3000
          }).present();
        });
      }
    })
    modal.present()
  }

}
