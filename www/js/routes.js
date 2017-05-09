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

      .state('tabsController.myFriends', {
        url: '/myfriends',
        views: {
          'tab5': {
            templateUrl: 'templates/myFriends.html',
            controller: 'myFriendsCtrl'
          }
        }
      })

      .state('tabsController.myCompetencies', {
        url: '/mycompetencies',
        views: {
          'tab5': {
            templateUrl: 'templates/myCompetencies.html',
            controller: 'myCompetenciesCtrl'
          },
        }
      })

      .state('tabsController.organisations', {
        url: '/organisations',
        views: {
          'tab5': {
            templateUrl: 'templates/organisations.html',
            controller: 'organisationsCtrl'
          }
        }
      })

      .state('tabsController.settings', {
        url: '/settings',
        views: {
          'tab5': {
            templateUrl: 'templates/settings.html',
            controller: 'settingsCtrl'
          }
        }
      })

      .state('tabsController.typography', {
        url: '/typography',
        views: {
          'tab10': {
            templateUrl: 'templates/typography.html',
            controller: 'typographyCtrl'
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
          'tab5': {
            templateUrl: 'templates/organisation_rk.html',
            controller: 'rkLinzCtrl'
          },
        }
      })

      .state('tabsController.task', {
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

      .state('tabsController.taskEdit', {
        url: '/task/:id/edit',
        views: {
          'tab1': {
            templateUrl: 'templates/taskEdit.html',
            controller: 'taskEditCtrl'
          },
          'tab2': {
            templateUrl: 'templates/taskEdit.html',
            controller: 'taskEditCtrl'
          },
          'tab3': {
            templateUrl: 'templates/taskEdit.html',
            controller: 'taskEditCtrl'
          }
        }
      })

      .state('tabsController.newTask', {
        // id param is optional
        url: '/newtask/:parentId',
        views: {
          'tab2': {
            templateUrl: 'templates/taskEdit.html',
            controller: 'taskEditCtrl'
          },
          'tab3': {
            templateUrl: 'templates/taskEdit.html',
            controller: 'taskEditCtrl'
          }
        }
      })

      //Open Leaflet Map//
      .state('tabsController.openMap', {
        // id param is optional
        url: '/newtask/map',
        params: {id:null, address:null},
        views: {
          'tab1': {
            templateUrl: 'templates/map.html',
            controller: 'MapController'
          },
          'tab2': {
            templateUrl: 'templates/map.html',
            controller: 'MapController'
          },
          'tab3': {
            templateUrl: 'templates/map.html',
            controller: 'MapController'
          }
        }
      })

      //Open Leaflet Map from Task View//
      .state('tabsController.openMapView', {
        // id param is optional
        url: '/task/:id/map',
        params: {id:null, address:null},
        views: {
          'tab1': {
            templateUrl: 'templates/mapView.html',
            controller: 'MapViewController'
          },
          'tab2': {
            templateUrl: 'templates/mapView.html',
            controller: 'MapViewController'
          },
          'tab3': {
            templateUrl: 'templates/mapView.html',
            controller: 'MapViewController'
          }
        }
      })

	  .state('tabsController.taskEditAdv', {
        url: '/task/:id/editAdv/:section',
        views: {
          'tab1': {
            templateUrl: 'templates/taskEditAdv.html',
            controller: 'taskEditAdvCtrl'
          },
          'tab2': {
            templateUrl: 'templates/taskEditAdv.html',
            controller: 'taskEditAdvCtrl'
          },
          'tab3': {
            templateUrl: 'templates/taskEditAdv.html',
            controller: 'taskEditAdvCtrl'
          }
        }
      })


      .state('tabsController.myCompetenciesInfo', {
        url: '/mycompetencies/:index',
        views: {
          'tab5': {
            templateUrl: 'templates/myCompetenciesInfo.html',
            controller: 'myCompetenciesInfoCtrl'
          },
        }
      })

      .state('tabsController.addCompetenceInfo', {
        url: '/addcompetence/:id',
        views: {
          'tab5': {
            templateUrl: 'templates/addCompetenceInfo.html',
            controller: 'addCompetenceInfoCtrl'
          },
        }
      })

      .state('tabsController.newCompetence', {
        url: '/newcompetence',
        views: {
          'tab5': {
            templateUrl: 'templates/newCompetence.html',
            controller: 'newCompetenceCtrl'
          },
        }
      })

      .state('tabsController.addCompetence', {
        url: '/addcompetence',
        views: {
          'tab5': {
            templateUrl: 'templates/addCompetence.html',
            controller: 'addCompetenceCtrl'
          },
        }
      })

      .state('tabsController.addCompetenceToTask', {
        url: '/addcompetencetotask/:id',
        views: {
          'tab2': {
            templateUrl: 'templates/addCompetenceToTask.html',
            controller: 'addCompetenceToTaskCtrl'
          }
        }
      })
      .state('tabsController.addCompetenceToTaskInfo', {
        url: '/addcompetencetotaskinfo/:compId/:taskId',
        views: {
          'tab2': {
            templateUrl: 'templates/addCompetenceToTaskInfo.html',
            controller: 'addCompetenceToTaskInfoCtrl'
          }
        }
      })


    //**********************************************
    //Alternative route -> Login
    //**********************************************
    $urlRouterProvider.otherwise('/login');


  });
