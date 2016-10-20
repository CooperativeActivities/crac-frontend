angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.alleAufgaben', {
    url: '/alltasks',
    views: {
      'tab2': {
        templateUrl: 'templates/alleAufgaben.html',
        controller: 'alleAufgabenCtrl'
      }
    }
  })

  .state('tabsController.meineAufgaben', {
    url: '/mytasks',
    views: {
      'tab3': {
        templateUrl: 'templates/meineAufgaben.html',
        controller: 'meineAufgabenCtrl'
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
  .state('tabsController.startseite', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/startseite.html',
        controller: 'startseiteCtrl'
      },
      'tab2': {
        templateUrl: 'templates/startseite.html',
        controller: 'startseiteCtrl'
      },
      'tab3': {
        templateUrl: 'templates/startseite.html',
        controller: 'startseiteCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/tabcontroller',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('anmelden', {
    url: '/login',
    templateUrl: 'templates/anmelden.html',
    controller: 'anmeldenCtrl'
  })

  .state('registrierung', {
    url: '/signup',
    templateUrl: 'templates/registrierung.html',
    controller: 'registrierungCtrl'
  })

  .state('willkommen', {
    url: '/welcome',
    templateUrl: 'templates/willkommen.html',
    controller: 'willkommenCtrl'
  })

  .state('profilAssistent', {
    url: '/profileassistent',
    templateUrl: 'templates/profilAssistent.html',
    controller: 'profilAssistentCtrl'
  })

  .state('tabsController.aufgabe2_enrolled', {
    url: '/task2enrolled',
    views: {
      'tab3': {
        templateUrl: 'templates/aufgabe2_enrolled.html',
        controller: 'aufgabe2_enrolledCtrl'
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
  .state('tabsController.aufgabe2', {
    url: '/task2',
    views: {
      'tab1': {
        templateUrl: 'templates/aufgabe2.html',
        controller: 'aufgabe2Ctrl'
      },
      'tab2': {
        templateUrl: 'templates/aufgabe2.html',
        controller: 'aufgabe2Ctrl'
      },
      'tab3': {
        templateUrl: 'templates/aufgabe2.html',
        controller: 'aufgabe2Ctrl'
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
  .state('tabsController.aufgabe1', {
    url: '/task1',
    views: {
      'tab1': {
        templateUrl: 'templates/aufgabe1.html',
        controller: 'aufgabe1Ctrl'
      },
      'tab2': {
        templateUrl: 'templates/aufgabe1.html',
        controller: 'aufgabe1Ctrl'
      },
      'tab3': {
        templateUrl: 'templates/aufgabe1.html',
        controller: 'aufgabe1Ctrl'
      }
    }
  })

  .state('tabsController.aufgabe1_enrolled', {
    url: '/task1enrolled',
    views: {
      'tab3': {
        templateUrl: 'templates/aufgabe1_enrolled.html',
        controller: 'aufgabe1_enrolledCtrl'
      }
    }
  })

  .state('tabsController.meinProfil', {
    url: '/myprofile',
    views: {
      'tab5': {
        templateUrl: 'templates/meinProfil.html',
        controller: 'meinProfilCtrl'
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
  .state('tabsController.meineKompetenzen', {
    url: '/mycompetencies',
    views: {
      'tab6': {
        templateUrl: 'templates/meineKompetenzen.html',
        controller: 'meineKompetenzenCtrl'
      },
      'tab8': {
        templateUrl: 'templates/meineKompetenzen.html',
        controller: 'meineKompetenzenCtrl'
      }
    }
  })

  .state('tabsController.einstellungen', {
    url: '/settings',
    views: {
      'tab7': {
        templateUrl: 'templates/einstellungen.html',
        controller: 'einstellungenCtrl'
      }
    }
  })

  .state('tabsController.kompetenzHinzufGen', {
    url: '/addcompetency',
    views: {
      'tab8': {
        templateUrl: 'templates/kompetenzHinzufGen.html',
        controller: 'kompetenzHinzufGenCtrl'
      }
    }
  })

  .state('tabsController.organisationen', {
    url: '/organisationen',
    views: {
      'tab9': {
        templateUrl: 'templates/organisationen.html',
        controller: 'organisationenCtrl'
      }
    }
  })

  .state('tabsController.nachrichten', {
    url: '/messages',
    views: {
      'tab10': {
        templateUrl: 'templates/nachrichten.html',
        controller: 'nachrichtenCtrl'
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
  .state('tabsController.rotesKreuzLinz', {
    url: '/selectedOrganisation',
    views: {
      'tab9': {
        templateUrl: 'templates/rotesKreuzLinz.html',
        controller: 'rotesKreuzLinzCtrl'
      },
      'tab11': {
        templateUrl: 'templates/rotesKreuzLinz.html',
        controller: 'rotesKreuzLinzCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/tabcontroller/tab1/home')

  

});