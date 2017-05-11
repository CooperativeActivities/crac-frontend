/*cracApp.component("navTabs",{
  templateUrl: 'components/navTabs/navTabs.html',
  controller:*/
cracApp.controller("navTabs", ['$state', function($state) {
    this.onTabSelect = function(tab) {
      console.log('onTabClick - navCtrl: ' + tab);
      $state.go('tabsController.'+tab, {});
    }
  }]
)
//});
