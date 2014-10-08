angular.module('starter.controllers', [])

.controller('MainController', function($scope, $state, $location, $ionicModal, AuthenticationService, APIService) {
  console.log("At Main Controller");

  $scope.message = "";
  
  $scope.user = {
    username: null,
    password: null
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    AuthenticationService.login($scope.user, function(err){
      console.log($scope.user);

      if (err) {
        $scope.message = err;
      } else {
        // User is authenticated
        $state.isAuthenticated = true;
        $state.go('app.pictures');
      }
    });
  };

  $scope.doLogOut = function() {
    AuthenticationService.logout();
    $state.go('login');
  }

  // Check if authenticated from token
  $scope.isAuthenticated = false;

  if (APIService.getToken()) {
    // User is already logged in
    $scope.isAuthenticated = true;
    $state.go('app.pictures');
  }
  else {
    $state.go('login');
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('LoginCtrl', function($scope, $state, $timeout, AuthenticationService, APIService) {


})

.controller('PictureCtrl', function($scope, APIService) {

  APIService.get('/api/pictures')
  .success(function (data, status, headers, config) {

    function partition(arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    }

    // append hostname to images
    var pictures = data.images.map(function(picture){
      picture.thumbnail_path = HOST + picture.thumbnail_path.replace('.','');
      picture.path = HOST + picture.path.replace('.','');
      return picture;
    });;

    // Split pictures in groups of rows
    $scope.partitionedPictures = partition(pictures, 2);

  });

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
