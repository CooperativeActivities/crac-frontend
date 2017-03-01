cracApp.controller('navCtrl', ['$state', function($state) {
	this.onTabSelect = function(tab) {
		console.log('onTabClick - navCtrl: ' + tab);
		$state.go('tabsController.'+tab, {});
	}
}]);
