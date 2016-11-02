angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('tabsController.allTasks', {
    url: '/alltasks',
    views: {
      'tab2': {
        templateUrl: 'templates/allTasks.html',
        controller: 'allTasksCtrl'
      }
    }
  })

  .state('tabsController.myTasks', {
    url: '/mytasks',
    views: {
      'tab3': {
        templateUrl: 'templates/myTasks.html',
        controller: 'myTasksCtrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.startseite'
      2) Using $state.go programatically:
        $state.go('tabsController.startseite');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /tabcontroller/tab1/home
      /tabcontroller/tab2/home
      /tabcontroller/tab3/home
  */

  .state('tabsController.home', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      },
      'tab2': {
        templateUrl: 'templates/allTasks.html',
        controller: 'allTasksCtrl'
      },
      'tab3': {
        templateUrl: 'templates/myTasks.html',
        controller: 'myTasksCtrl'
      }
    }
  })

/*
    .state('tabsController.home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })
*/

  .state('tabsController', {
    url: '/tabcontroller',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'welcomeCtrl'
  })

  .state('profileAssistent', {
    url: '/profileassistent',
    templateUrl: 'templates/profileAssistent.html',
    controller: 'profileAssistentCtrl'
  })

  .state('tabsController.task2enrolled', {
    url: '/task2enrolled',
    views: {
      'tab3': {
        templateUrl: 'templates/task2enrolled.html',
        controller: 'task2enrolledCtrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.aufgabe2'
      2) Using $state.go programatically:
        $state.go('tabsController.aufgabe2');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /tabcontroller/tab1/task2
      /tabcontroller/tab2/task2
      /tabcontroller/tab3/task2
  */
  .state('tabsController.task2', {
    url: '/task2',
    views: {
      'tab1': {
        templateUrl: 'templates/task2.html',
        controller: 'task2Ctrl'
      },
      'tab2': {
        templateUrl: 'templates/task2.html',
        controller: 'task2Ctrl'
      },
      'tab3': {
        templateUrl: 'templates/task2.html',
        controller: 'task2Ctrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.aufgabe1'
      2) Using $state.go programatically:
        $state.go('tabsController.aufgabe1');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /tabcontroller/tab1/task1
      /tabcontroller/tab2/task1
      /tabcontroller/tab3/task1
  */
  .state('tabsController.task1', {
    url: '/task/:id',
    views: {
      'tab1': {
        templateUrl: 'templates/task.html',
        controller: 'singleTaskCtrl'
      }
    }
  })

  .state('tabsController.task1enrolled', {
    url: '/task1enrolled',
    views: {
      'tab3': {
        templateUrl: 'templates/task1enrolled.html',
        controller: 'task1enrolledCtrl'
      }
    }
  })

  .state('tabsController.myProfile', {
    url: '/myprofile',
    views: {
      'tab5': {
        templateUrl: 'templates/myProfile.html',
        controller: 'myProfileCtrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.meineKompetenzen'
      2) Using $state.go programatically:
        $state.go('tabsController.meineKompetenzen');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /tabcontroller/tab6/mycompetencies
      /tabcontroller/tab8/mycompetencies
  */
  .state('tabsController.myCompetencies', {
    url: '/mycompetencies',
    views: {
      'tab6': {
        templateUrl: 'templates/myCompetencies.html',
        controller: 'myCompetenciesCtrl'
      },
      'tab8': {
        templateUrl: 'templates/myCompetencies.html',
        controller: 'myCompetenciesCtrl'
      }
    }
  })

  .state('tabsController.settings', {
    url: '/settings',
    views: {
      'tab7': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('tabsController.addCompetency', {
    url: '/addcompetency',
    views: {
      'tab8': {
        templateUrl: 'templates/addCompetency.html',
        controller: 'addCompetencyCtrl'
      }
    }
  })

  .state('tabsController.organisations', {
    url: '/organisations',
    views: {
      'tab9': {
        templateUrl: 'templates/organisations.html',
        controller: 'organisationsCtrl'
      }
    }
  })

  .state('tabsController.messages', {
    url: '/messages',
    views: {
      'tab10': {
        templateUrl: 'templates/messages.html',
        controller: 'messagingCtrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.rotesKreuzLinz'
      2) Using $state.go programatically:
        $state.go('tabsController.rotesKreuzLinz');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /tabcontroller/tab9/selectedOrganisation
      /tabcontroller/tab11/selectedOrganisation
  */
  .state('tabsController.organisation_rk', {
    url: '/organisation_rk',
    views: {
      'tab9': {
        templateUrl: 'templates/organisation_rk.html',
        controller: 'rkLinzCtrl'
      },
      'tab11': {
        templateUrl: 'templates/organisation_rk.html',
        controller: 'rkLinzCtrl'
      }
    }
  })

/*$urlRouterProvider.otherwise('/tabcontroller/tab1/home')*/
$urlRouterProvider.otherwise('/login');



});
