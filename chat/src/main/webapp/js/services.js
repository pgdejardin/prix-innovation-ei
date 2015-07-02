/* global define */

'use strict';

define(['angular', 'atmosphere'], function(angular, atmosphere) {

  var services = angular.module('myApp.services', []);

  services.service('AtmosphereService', function($rootScope) {
    var responseParameterDelegateFunctions = ['onOpen', 'onClientTimeout', 'onReopen', 'onMessage', 'onClose', 'onError'];
    var delegateFunctions = responseParameterDelegateFunctions;
    delegateFunctions.push('onTransportFailure');
    delegateFunctions.push('onReconnect');

    return {
      subscribe: function(r) {
        var result = {};

        angular.forEach(r, function(value, property) {
          if (typeof value === 'function' && delegateFunctions.indexOf(property) >= 0) {
            if (responseParameterDelegateFunctions.indexOf(property) >= 0) {
              result[property] = function(response) {
                $rootScope.$apply(function() {
                  r[property](response);
                });
              };
            } else if (property === 'onTransportFailure') {
              result.onTransportFailure = function(errorMsg, request) {
                $rootScope.$apply(function() {
                  r.onTransportFailure(errorMsg, request);
                });
              };
            } else if (property === 'onReconnect') {
              result.onReconnect = function(request, response) {
                $rootScope.$apply(function() {
                  r.onReconnect(request, response);
                });
              };
            }
          } else {
            result[property] = r[property];
          }
        });

        return atmosphere.subscribe(result);
      }
    };
  });

  services.service('ChatRoomService', ['$http', function($http) {
    return {
      getRooms: function() {
        return $http.get('/rest/chat-room', {responseType: 'json'});
      },
      createRoom: function(roomName) {
        return $http.put('/rest/chat-room/' + roomName, null, {responseType: 'json'});
      },
      getUsers: function(roomName) {
        return $http.get('/rest/chat-room/' + roomName + '/users');
      },
      removeUser: function(userName, roomName) {
        return $http.post('/rest/chat-room/' + roomName + '/remove', {username: userName} )
      },
      addUserToRoom: function(userName, uuid, roomName) {
        return $http.post('/rest/chat-room/' + roomName + '/user', {uuid:uuid, username: userName});
      },
      updateUserToRoom: function(userName, roomName) {
        return $http.post('/rest/chat-room/' + roomName + '/update', {username: userName});
      }
    };
  }]);

  services.service('UserService', ['$http', '$location', function($http, $location) {
    var user = '';
    return {
      setUser: function(userName) {
        user = userName;
      },
      getUser: function() {
        if (user.length <= 0) {
          $location.path('/login');
        }
        return user;
      }
    };
  }]);
});
