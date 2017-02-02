cracApp.directive('cAccordion', ["TaskDataService", function(TaskDataService) {
  return {
    transclude: true,
    link: function(scope, element, attr){
    },
    scope: {
      title: "=",
      shown: "=?"
    },
    templateUrl: 'templates/directives/cAccordion.html'
  };
}]);
