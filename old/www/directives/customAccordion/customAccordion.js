cracApp.directive('customAccordion', [function() {
  return {
    transclude: {
        'head': 'customAccordionHead',
        'body': 'customAccordionBody',
      },
    scope: {
      shown: "=?"
    },
    templateUrl: 'directives/customAccordion/customAccordion.html'
  };
}]);
