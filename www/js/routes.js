angular.module('app.routes', ['ionicUIRouter'])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

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


    //**********************************************
    //Tabs Routes
    //**********************************************
      .state('tabsController', {
       // cache: false,
        url: '/tabcontroller',
        templateUrl: 'templates/tabsController.html',
        abstract: true
      })

      .state('tabsController.home', {
        url: '/home',
        views: {
          'tab1': {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
          }
        }
      })

      .state('tabsController.tasklist', {

        url: '/tasklist',
        views: {
          'tab2': {
            templateUrl: 'templates/tasklist.html',
            controller: 'tasklistCtrl'
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

      .state('tabsController.messages', {
        url: '/messages',
        views: {
          'tab4': {
            templateUrl: 'templates/messages.html',
            controller: 'messagingCtrl'
          }
        }
       })

      //**********************************************
      //Sidemenu
      //**********************************************
      .state('tabsController.myProfile', {
        url: '/myprofile',
        views: {
          'tab5': {
            templateUrl: 'templates/myProfile.html',
            controller: 'myProfileCtrl'
          }
        }
      })

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


      .state('tabsController.organisations', {
        url: '/organisations',
        views: {
          'tab9': {
            templateUrl: 'templates/organisations.html',
            controller: 'organisationsCtrl'
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


      //**********************************************
      //Without Tabs
      //**********************************************
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






      //**********************************************
      //TEMPORARY
      //**********************************************

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

      .state('tabsController.task1', {
        url: '/task/:id',
        views: {
          'tab1': {
            templateUrl: 'templates/task.html',
            controller: 'singleTaskCtrl'
          },
          'tab2': {
            templateUrl: 'templates/task.html',
            controller: 'singleTaskCtrl'
          },
          'tab3': {
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


      .state('tabsController.task2enrolled', {
        url: '/task2enrolled',
        views: {
          'tab3': {
            templateUrl: 'templates/task2enrolled.html',
            controller: 'task2enrolledCtrl'
          }
        }
      })

      .state('tabsController.myCompetenciesInfo', {
        url: '/mycompetencies/:index',
        views: {
          'tab6': {
            templateUrl: 'templates/myCompetenciesInfo.html',
            controller: 'myCompetenciesInfoCtrl'
          },
          'tab8': {
            templateUrl: 'templates/myCompetenciesInfo.html',
            controller: 'myCompetenciesInfoCtrl'
          }
        }
      })

      .state('tabsController.addCompetenceInfo', {
        url: '/addcompetence/:id',
        views: {
          'tab6': {
            templateUrl: 'templates/addCompetenceInfo.html',
            controller: 'addCompetenceInfoCtrl'
          },
          'tab8': {
            templateUrl: 'templates/addCompetenceInfo.html',
            controller: 'addCompetenceInfoCtrl'
          }
        }
      })

      .state('tabsController.newCompetence', {
        url: '/newcompetence',
        views: {
          'tab6': {
            templateUrl: 'templates/newCompetence.html',
            controller: 'newCompetenceCtrl'
          },
          'tab8': {
            templateUrl: 'templates/newCompetence.html',
            controller: 'newCompetenceCtrl'
          }
        }
      })

      .state('tabsController.addCompetence', {
        url: '/addcompetence',
        views: {
          'tab6': {
            templateUrl: 'templates/addCompetence.html',
            controller: 'addCompetenceCtrl'
          },
          'tab8': {
            templateUrl: 'templates/addCompetence.html',
            controller: 'addCompetenceCtrl'
          }
        }
      })

      .state('tabsController.newTask', {
        url: '/newtask',
        views: {
          'tab2': {
            templateUrl: 'templates/newTask.html',
            controller: 'newTaskCtrl'
          }
        }
      })

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
      });






    //**********************************************
    //Alternative route -> Login
    //**********************************************
    $urlRouterProvider.otherwise('/login');


  });
