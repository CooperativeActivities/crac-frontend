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
    }, (error) => {
      //@TODO error shows when user has no competences, should come as success
    });
  }

  remove(id){
    this.alert.create({
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
            this.userDataService.removeCompetence(id).then((res) => {
              let index = _.findIndex(this.competences, {competence: {id: id}});
              this.competences.splice(index, 1)[0];
              this.toast.create({
                message: "Kompetenz gelöscht",
                position: 'top',
                duration: 3000
              }).present();
            }, (error) => {
              this.toast.create({
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
    this.userDataService.updateCompetence(c.competence.id, c.likeValue, c.proficiencyValue).then(res => {
      this.toast.create({
        message: "Kompetenz gespeichert",
        position: 'top',
        duration: 3000
      }).present();
    }, (error) => {
      this.toast.create({
        message: "Kompetenz kann nicht gespeichert werden: " + error.message,
        position: 'top',
        duration: 3000
      }).present();
    });
  }

  addCompetence() {
    const competences = this.competences.map(c => c.competence.id)
    const modal = this.modalCtrl.create("competence-select-modal", { select_for: "user", usedCompetences: competences })

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
