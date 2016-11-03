// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var cracApp = angular.module('app', ['ionic', 'ngCookies','ngRoute', 'app.controllers', 'app.routes', 'app.directives', 'app.services',])

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
  }

   //register event -> locationChangeStart is thrown wenn URL is changed
   $rootScope.$on('$locationChangeStart', function (event, next, current) {
     // redirect to login page if not logged in and trying to access a restricted page
     //var restrictedPage = $.inArray($location.path(), ['/admin']) === -1;
     var restrictedPage = $location.path().indexOf("/login") == -1
     console.log(restrictedPage)
     var loggedIn = $rootScope.globals.currentUser;
     if (restrictedPage && !loggedIn) {
       $location.path('/login');
     }
   });

})
