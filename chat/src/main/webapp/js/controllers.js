/* global define */

define(['angular', 'atmosphere'], function(angular, atmosphere) {
  'use strict';

  var controllersModule = angular.module('myApp.controllers', []);

  controllersModule.controller('ChatRoomController', ['$scope', '$routeParams', 'uiGmapGoogleMapApi', 'UserService', 'AtmosphereService', function($scope, $routeParams, uiGmapGoogleMapApi,
                                                                                                                                                   UserService, AtmosphereService) {

    uiGmapGoogleMapApi.then(function(maps) {

    });

    $scope.model = {
      room: $routeParams.room,
      name: UserService.getUser(),
      transport: 'websocket',
      messages: []
    };


    $scope.map = {
      center: {
        latitude: null,
        longitude: null
      },
      zoom: 11,
      events: {
        click: function(mapModel, eventName, originalEventArgs) {
          alert('action done');
        }
      }
    };
    $scope.marker = {};
    $scope.fakeMarkers = [
      {
        id: 2,
        name: 'user-2',
        coords: {
          latitude: 48.6967513,
          longitude: 2.302947
        },
        options: {
          draggable: false,
          title: 'user-2'
        },
        events: {
          click: function(mapModel, eventName, originalEventArgs) {
            console.debug('mapModel', mapModel);
            console.debug('eventName', eventName);
            console.debug('originalEventArgs', originalEventArgs);
          }
        }
      },
      {
        id: 3,
        name: 'user-3',
        coords: {
          latitude: 48.7967513,
          longitude: 2.298547
        },
        options: {draggable: false}
      }
    ];

    var init = function() {
      if (navigator.geolocation) {
        //console.debug('navigator.geolocation?:', navigator.geolocation);
        navigator.geolocation.getCurrentPosition(function(position) {
          console.debug('position.coords.latitude:', position.coords.latitude);
          console.debug('position.coords.longitude:', position.coords.longitude);
          $scope.map.center.latitude = position.coords.latitude;
          $scope.map.center.longitude = position.coords.longitude;
          $scope.marker = {
            id: 1,
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            options: {
              draggable: false,
              title: $scope.model.name
            }
          };
          //var pos = maps.LatLng(position.coords.latitude, position.coords.longitude);
        });
      }
    };

    init();

    var socket;

    var request = {
      url: '/ws/chat/' + $scope.model.room,
      contentType: 'application/json',
      transport: 'websocket',
      trackMessageLength: true,
      reconnectInterval: 5000,
      enableXDR: true,
      timeout: 3600000
    };

    request.onOpen = function(response) {
      $scope.model.transport = response.transport;
      $scope.model.connected = true;
      $scope.model.content = 'Atmosphere connected using ' + response.transport;
    };

    request.onClientTimeout = function() {
      $scope.model.content = 'Client closed the connection after a timeout. Reconnecting in ' + request.reconnectInterval;
      $scope.model.connected = false;
      setTimeout(function() {
        socket = AtmosphereService.subscribe(request);
      }, request.reconnectInterval);
    };

    request.onReopen = function(response) {
      $scope.model.connected = true;
      $scope.model.content = 'Atmosphere re-connected using ' + response.transport;
    };

    request.onMessage = function(response) {
      function parseMessage(msg) {
        var date = typeof(msg.time) === 'string' ? parseInt(msg.time) : msg.time;
        $scope.model.messages.push({
          author: msg.author,
          date: new Date(date),
          text: msg.message
        });
      }

      var responseText = response.responseBody;
      var message = atmosphere.util.parseJSON(responseText);
      if (Array.isArray(message)) {
        message.map(function(msg) {
          parseMessage(msg);
        });
      } else {
        parseMessage(message);
      }
    };

    request.onClose = function() {
      $scope.model.connected = false;
      $scope.model.content = 'Server closed the connection after a timeout';
    };

    request.onError = function() {
      $scope.model.content = 'Sorry, but there\'s some problem with your socket or the server is down';
    };

    request.onReconnect = function(request) {
      $scope.model.content = 'Connection lost. Trying to reconnect ' + request.reconnectInterval;
      $scope.model.connected = false;
    };

    socket = AtmosphereService.subscribe(request);

    $scope.keypress = function(event) {
      if (!!$scope.model.message && $scope.model.message.length > 0 && event.keyCode === 13) {
        socket.push(atmosphere.util.stringifyJSON({
          author: $scope.model.name,
          message: $scope.model.message
        }));
        $scope.model.message = '';
      }
    };
  }]);

  controllersModule.controller('ChatRoomChoiceController', ['$scope', 'UserService', 'ChatRoomService', function($scope, UserService, ChatRoomService) {
    function isEnterOrMouseFirstButton(e) {
      return (e.type === 'click' && e.which === 1) || (e.type === 'keypress' && e.which === 13);
    }

    function initRooms() {
      ChatRoomService.getRooms().then(function(data) {
        $scope.rooms = data.data;
      });
    }

    UserService.getUser();
    initRooms();

    $scope.createRoom = function(event) {
      if (isEnterOrMouseFirstButton(event) && !!$scope.roomName && $scope.roomName.length > 0) {
        ChatRoomService.createRoom($scope.roomName).then(function() {
          initRooms();
        }, function(error) {
          console.log('error : ', error);
        });
      }
    };

  }]);

  controllersModule.controller('LoginController', ['$scope', '$location', 'UserService', function($scope, $location, UserService) {
    function isEnterOrMouseFirstButton(e) {
      return (e.type === 'click' && e.which === 1) || (e.type === 'keypress' && e.which === 13);
    }

    $scope.attemptLogin = function(event) {
      if (isEnterOrMouseFirstButton(event) && !!$scope.login && $scope.login.length > 0) {
        UserService.setUser($scope.login);
        $location.path('/chat-room-choice');
      }
    };

  }]);
});
