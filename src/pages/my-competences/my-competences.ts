import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public userDataService: UserDataService) {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyCompetencesPage');
  }

}
  /*
  $scope.competenceInfo = function(indx){
    $state.go('tabsController.myCompetenciesInfo', { index:indx });
  };
  $scope.createNewCompetence = function(){
    $state.go('tabsController.newCompetence');
  };

  $scope.addCompetence = function(){
    $state.go('tabsController.addCompetence');
  };

  $scope.remove = function(id){
    UserDataService.removeCompetence(id).then(function(res){
      UserDataService.getCompRelationships().then(function(res){
        $scope.competences = res.object;
        console.log($scope.competences);
      }, function(error) {
        //@TODO error shows when user has no competences, should come as success
      });
    }, function(error) {
      ionicToast.show("Kompetenz kann nicht gelöscht werden: " + error.message, 'top', false, 5000);
    });
  }
}]);
   */
