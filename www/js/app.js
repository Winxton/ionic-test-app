// Ionic Starter App

// Global Var -> API HOST URL
var HOST = "http://192.168.1.135:8080";

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ui.router', 'starter.controllers', 'starter.services'])

.run(function($rootScope, $ionicPlatform, $httpBackend, $http, APIService) {

  // Set host for api
  APIService.setHost(HOST);

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })  

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.pictures', {
      url: "/pictures",
      views: {
        'menuContent' :{
          templateUrl: "templates/pictures.html",
          controller: 'PictureCtrl'
        }
      }
    })

    .state('app.display', {
      url: "/display/:pictureId/:pictureName",
      views: {
          'menuContent': {
              templateUrl: "templates/display.html",
              controller: 'DisplayCtrl'
          }
      }
    })

    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
})

// If user gets a 401 (unauthorized), go back to the login page
.factory('authInterceptor',['$q','$location', '$window' ,function($q, $location,$window,APIService){
    return {
        response: function(response){
            if (response.status === 401) {
                $location.path('/login');
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);
                // APIService.removeToken();
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    }
}])
.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authInterceptor');
}]);
