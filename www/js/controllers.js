angular.module('starter.controllers', [])

.controller('MainController', function($scope, $location, $ionicModal) {
  console.log("Main Controller");

  // Check if authenticated from token
  $scope.isAuthenticated = false;

  if ($scope.isAuthenticated) {

  }
  else {

    $location.path('login');
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('LoginCtrl', function($scope, $state, $timeout, AuthenticationService, $rootScope) {
  $scope.message = "";
  
  $scope.user = {
    username: null,
    password: null
  };
 
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    AuthenticationService.login($scope.user, function(err){
      if (err) {
        $scope.message = err;
      } else {
        // User is authenticated
        $state.isAuthenticated = true;
        $state.go('app.playlists');
      }
    });
  };

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
