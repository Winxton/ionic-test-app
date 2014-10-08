angular.module('starter.services', [])
.factory('AuthenticationService', function($rootScope, $http, $httpBackend, APIService) {
  var service = {
    login: function(user, callback) {
      // Get Token from server
      $http.post(HOST + '/authenticate', { username: user.username, password: user.password }, { ignoreAuthModule: true })

      .success(function (data, status, headers, config) {
        if (data.error) {
          callback(data.error);
        }
        else {
          // Set Access Token
          APIService.setToken(data.token);
          callback(null);
        }
      })

      .error(function (data, status, headers, config) {
        callback("Internal Error");
      });

    },
    logout: function(user) {
        APIService.removeToken();
    }
  };
  return service;
})

// A wrapper for calls to the API
.factory('APIService', ['$http', '$window', function ($http, $window) {
    var serviceToken, serviceHost;

    if (localStorage.getItem('token')) {
        serviceToken = $window.localStorage.getItem('token');
    }

    return {
        setHost: function (host) {
            serviceHost = host;
        },
 
        setToken: function (token) {
            serviceToken = token;
            $window.localStorage.setItem('token', token);
        },
 
        getToken: function () {
            return serviceToken;
        },
 
        removeToken: function() {
            serviceToken = undefined;
            $window.localStorage.removeItem('token');
        },
 
        get: function (uri, params) {

            return $http.get(serviceHost + uri, 
              {
                params: params,
                headers: {'x-access-token' : serviceToken}
              });
        },
 
        post: function (uri, params) {
            return $http.post(serviceHost + uri, 
              {
                params: params,
                headers: {'x-access-token' : serviceToken}
              });
        }
    };
}]);
