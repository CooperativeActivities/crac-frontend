// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var cracApp = angular.module('app', ['ionic', 'ngCookies','ngRoute', 'app.controllers', 'app.routes', 'app.directives', 'app.services','leaflet-directive','ngCordova',])

  .config(function ($ionicConfigProvider) {

  })

cracApp.run(function ($ionicPlatform, $rootScope, $location,$cookieStore,$http) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //$http.defaults.withCredentials = true;
  $rootScope.globals = $cookieStore.get('globals') || {};
  if($rootScope.globals.currentUser != null){
    $http.defaults.headers.common['Token'] = $rootScope.globals.currentUser.token; // jshint ignore:line
    $http.defaults.headers.common['Authorization'] = $cookieStore.get('basic');
    // cannot call loggedIn here cause the controllers haven't been loaded yet
    //$rootScope.$emit("loggedIn")
  }

   //register event -> locationChangeStart is thrown wenn URL is changed
   $rootScope.$on('$locationChangeStart', function (event, next, current) {
     // redirect to login page if not logged in and trying to access a restricted page
     //var restrictedPage = $.inArray($location.path(), ['/admin']) === -1;
     var restrictedPage = $location.path().indexOf("/login") == -1
     //console.log(restrictedPage)
     var loggedIn = $rootScope.globals.currentUser;
     if (restrictedPage && !loggedIn) {
       $location.path('/login');
     }
   });
})

/*
 //this does not work together with ng-model
// form polyfill
webshim.setOptions("basePath", "lib/webshim-1.16.0/js-webshim/dev/shims/")
webshim.setOptions("forms-ext", {
  replaceUI: false, //if "auto" is used here, it replaces it on some tablets it wouldnt need to
                      //false means it really only replaces when necessary (eg. firefox, but not chrome)
  types: "date number datetime-local",
  date: {
    startView: 2,
    openOnFocus: true,
  },
  widgets: {
    calculateWidth: false,
  },
});
webshim.polyfill("forms forms-ext");

cracApp.directive('input', function() {
  return {
    restrict: 'E',
    priority: -1,
    link: function(scope, element, attrs) {
      switch(attrs.type){
        case "date":
        //case "datetime":
        case "datetime-local":
        case "number":
          console.log("hey")
          $(element).updatePolyfill();
          break
      }
    }
  }
})
*/
