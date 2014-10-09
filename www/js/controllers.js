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
        // reset
        $scope.message = "";
        $scope.user = {
          username: null,
          password: null
        };
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

.controller('PictureCtrl', function($scope, $ionicLoading, $ionicActionSheet, APIService) {
  //$ionicLoading.show(); // looks pretty bad if loading is fast

  APIService.get('/api/pictures')
  .success(function (data, status, headers, config) {

    // split into groups
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
    });

    // Split pictures in groups of rows
    $scope.partitionedPictures = partition(pictures, 2);

    //$ionicLoading.hide();
  });

    $scope.showActionItems = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Upload Photo' },
                { text: 'Use Camera' },
                { text: 'Add Text' },
            ],
            cancelText: 'Cancel',
            cancel: function() {
                hideSheet();
            },
            buttonClicked: function(index) {
                console.log(index);
                // Upload Photo
                if (index === 0) {

                }
                // Use Camera
                else if (index === 1) {

                }
                // Add Text
                else if (index === 2) {

                }

                return true;
            }
        });
    };

})

.controller('DisplayCtrl', function($scope, $stateParams, APIService, $ionicPopover){
    var pictureId = $stateParams.pictureId;
    $scope.pictureName = $stateParams.pictureName;

    function getIndexOfDefaultDevice(devices) {
        for (var idx in devices) {
            if (devices[idx].prime === true) {
                return idx;
            }
        }
        return 0;
    }

    APIService.getDevices()
    .success(function (data, status, headers, config) {
        $scope.devices = data.devices;

        var defaultIdx = getIndexOfDefaultDevice(data.devices);
        $scope.selectedDevice = data.devices[defaultIdx];

        APIService.getImageUri(pictureId, $scope.selectedDevice.width, $scope.selectedDevice.height)
        .success(function (data, status, headers, config) {
                $scope.imageData = data;
        });
    });

    // User changes the Device
    $scope.changeDevice = function(device) {

        APIService.getImageUri(pictureId, device.width, device.height)
            .success(function (data, status, headers, config) {

            $scope.imageData = data;
         });
    };

    // TEMPORARY
    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
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
