cracApp.directive('cAccordion', ["TaskDataService", function(TaskDataService) {
  return {
    transclude: true,
    link: function(scope, element, attr){
    },
    scope: {
      title: "=",
      shown: "=?"
    },
    templateUrl: 'directives/cAccordion/cAccordion.html'
  };
}]);
