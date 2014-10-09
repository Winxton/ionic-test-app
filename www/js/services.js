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

    var APIService = {};

    APIService.setHost =  function (host) {
        serviceHost = host;
    };

    APIService.setToken = function (token) {
        serviceToken = token;
        $window.localStorage.setItem('token', token);
    };

    APIService.getToken = function () {
        return serviceToken;
    };

    APIService.removeToken = function() {
        serviceToken = undefined;
        $window.localStorage.removeItem('token');
    };

    APIService.get = function (uri, params) {

        return $http.get(serviceHost + uri,
          {
            params: params,
            headers: {'x-access-token' : serviceToken}
          });
    };

    APIService.post = function (uri, params) {
        return $http(
          {
            method: "POST",
            url: serviceHost + uri,
            data: params,
            headers: {'x-access-token' : serviceToken}
          });
    };

    APIService.getImageUri = function(pictureId, width, height) {
        var params = {
            format: "URL",
            type: "displayPreview",
            id: pictureId,
            convert : true,
            resize: true,
            width: width,
            height: height
        };
        return this.post('/api/getDataUri', params);
    };

    APIService.getDevice = function(deviceId) {
        return this.get('/api/device/' + deviceId, params);
    };

    APIService.getDevices = function() {
      return this.get('/api/devices');
    };

    return APIService;
}]);
