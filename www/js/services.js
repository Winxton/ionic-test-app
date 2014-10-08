angular.module('starter.services', [])
.factory('AuthenticationService', function($rootScope, $http, $httpBackend) {
  var service = {
    login: function(user, callback) {

      // Get Token from server
      $http.post('http://192.168.1.135:8080/authenticate', 
        { username: user.username, password: user.password }, 
        { ignoreAuthModule: true })

      .success(function (data, status, headers, config) {
        if (data.error) {
          callback(data.error);
        }
        else {
           $http.defaults.headers.common['x-access-token'] = data.token;  // Step 1
           callback(null);
        }
      })

      .error(function (data, status, headers, config) {
        callback("Internal Error");
      });

    },
    logout: function(user) {
        delete $http.defaults.headers.common['x-access-token'];
    }
  };
  return service;
})

.factory('LoginModalService', function($rootScope) {
  var service = {
    broadcastLoginRequired: function() {
        console.log("broadcasting...");
        $rootScope.$broadcast('event:auth-loginRequired');
    }
  };
  return service;
})