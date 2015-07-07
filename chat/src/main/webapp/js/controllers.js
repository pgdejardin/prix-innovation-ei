/* global define */

define(['angular', 'atmosphere'], function (angular, atmosphere) {
  'use strict';

  var controllersModule = angular.module('myApp.controllers', []);

  controllersModule.controller('ChatRoomController', ['$scope', '$routeParams', '$interval', 'uiGmapGoogleMapApi', 'UserService',
    'AtmosphereService', 'ChatRoomService', '$timeout',
    function ($scope, $routeParams, $interval, uiGmapGoogleMapApi, UserService, AtmosphereService, ChatRoomService, $timeout) {

      $scope.model = {
        room: $routeParams.room,
        name: UserService.getUser(),
        uuid: '',
        loc: null,
        transport: 'websocket',
        messages: []
      };
      $scope.users = [];

      $scope.map = {
        center: {
          latitude: 48.8883984,
          longitude: 2.2889508
        },
        zoom: 11,
        events: {
          click: function (mapModel, eventName, originalEventArgs) {
            alert('action done');
          }
        }
      };
      $scope.fakeMarkers = [
        {
          id: 2,
          name: 'user-2',
          coords: {
            latitude: 48.8967513,
            longitude: 2.302947
          },
          options: {
            draggable: false,
            title: 'user-2'
          },
          events: {
            click: function (mapModel, eventName, originalEventArgs) {
              //console.debug('mapModel', mapModel);
              //console.debug('eventName', eventName);
              //console.debug('originalEventArgs', originalEventArgs);
            }
          },
          info: {
            options: {
              content: 'user : user-2' + '<br>' + 'latitude: 48.8967513' + '<br>' + 'longitude: 2.302947'
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
          options: {
            draggable: false,
            title: 'user-3'
          },
          info: {
            options: {
              content: 'user : user-3' + '<br>' + 'latitude: 48.7967513' + '<br>' + 'longitude: 2.298547'
            }
          }
        },
        {
          id: 4,
          name: 'user-4',
          coords: {
            latitude: 48.7467217,
            longitude: 2.288497
          },
          options: {
            draggable: false,
            title: 'user-4'
          },
          info: {
            options: {
              content: 'user : user-4' + '<br>' + 'latitude: 48.7967217' + '<br>' + 'longitude: 2.298497'
            }
          }
        },
        {
          id: 5,
          name: 'user-5',
          coords: {
            latitude: 48.8270041,
            longitude: 2.309285
          },
          options: {
            draggable: false,
            title: 'user-5'
          },
          info: {
            options: {
              content: 'user : user-5' + '<br>' + 'latitude: 48.7970041' + '<br>' + 'longitude: 2.299285'
            }
          }
        }
      ];
      $scope.markers = angular.extend([], $scope.fakeMarkers);

      var init = function () {
        function getUsers() {
          ChatRoomService.getUsers($routeParams.room).success(function (res) {
            $scope.users = res;
          }).error(function (err) {
            console.error(err);
          });
        }

        $interval(function () {
          getUsers();
        }, 5000);
        getUsers();

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude = position.coords.longitude;
            $scope.model.loc = {
              lat: position.coords.latitude,
              long: position.coords.longitude
            };
            addUserToRoom();
            var marker = {
              id: 1,
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              options: {
                draggable: false,
                title: $scope.model.name
              },
              info: {
                options: {
                  content: 'user : ' + $scope.model.name + '<br>' + 'latitude: ' + position.coords.latitude + '<br>' + 'longitude: ' +
                  position.coords.longitude
                }
              }
            };
            $scope.markers.push(marker);
          });
        }
      };

      var addUserToRoom = function () {
        if (!_.isNull($scope.model.loc)) {
          ChatRoomService.addUserToRoom2({
            username: $scope.model.name,
            uuid: $scope.model.uuid,
            latitude: $scope.model.loc.lat,
            longitude: $scope.model.loc.long
          }, $routeParams.room);
        }
      };

      $scope.$on('$destroy', function () {
        AtmosphereService.unsubscribe();
      });

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

      request.onOpen = function (response) {
        $scope.model.uuid = response.request.uuid;
        init();
        $scope.model.transport = response.transport;
        $scope.model.connected = true;
        $scope.model.content = 'Atmosphere connected using ' + response.transport;
      };

      request.onClientTimeout = function () {
        $scope.model.content = 'Client closed the connection after a timeout. Reconnecting in ' + request.reconnectInterval;
        $scope.model.connected = false;
        setTimeout(function () {
          socket = AtmosphereService.subscribe(request);
        }, request.reconnectInterval);
      };

      request.onReopen = function (response) {
        $scope.model.connected = true;
        $scope.model.content = 'Atmosphere re-connected using ' + response.transport;
      };

      request.onMessage = function (response) {
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
          message.map(function (msg) {
            parseMessage(msg);
          });
        } else {
          parseMessage(message);
        }
        $timeout(function () {
          var objDiv = document.getElementById('messages');
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 100)
      };

      request.onClose = function () {
        $scope.model.connected = false;
        $scope.model.content = 'Server closed the connection after a timeout';
      };

      request.onError = function () {
        $scope.model.content = 'Sorry, but there\'s some problem with your socket or the server is down';
      };

      request.onReconnect = function (request) {
        $scope.model.content = 'Connection lost. Trying to reconnect ' + request.reconnectInterval;
        $scope.model.connected = false;
      };

      socket = AtmosphereService.subscribe(request);

      $scope.keypress = function (event) {
        if (!!$scope.model.message && $scope.model.message.length > 0 && event.keyCode === 13) {
          socket.push(atmosphere.util.stringifyJSON({
            author: $scope.model.name,
            message: $scope.model.message
          }));
          $scope.model.message = '';
        }
      };
    }
  ]);

  controllersModule.controller('ChatRoomChoiceController', ['$scope', 'UserService', 'ChatRoomService',
    function ($scope, UserService, ChatRoomService) {
      function isEnterOrMouseFirstButton(e) {
        return (e.type === 'click' && e.which === 1) || (e.type === 'keypress' && e.which === 13);
      }

      function initRooms() {
        ChatRoomService.getRooms().then(function (data) {
          $scope.rooms = data.data;
        });
      }

      $scope.user = UserService.getUser();
      initRooms();

      $scope.createRoom = function (event) {
        if (isEnterOrMouseFirstButton(event) && !!$scope.roomName && $scope.roomName.length > 0) {
          ChatRoomService.createRoom($scope.roomName).then(function () {
            initRooms();
          }, function (error) {
            console.log('error : ', error);
          });
        }
      };

    }]);

  controllersModule.controller('LoginController', ['$scope', '$location', 'UserService', function ($scope, $location, UserService) {
    function isEnterOrMouseFirstButton(e) {
      return (e.type === 'click' && e.which === 1) || (e.type === 'keypress' && e.which === 13);
    }

    $scope.attemptLogin = function (event) {
      if (isEnterOrMouseFirstButton(event) && !!$scope.login && $scope.login.length > 0) {
        UserService.setUser($scope.login);
        $location.path('/chat-room-choice');
      }
    };

  }]);
});
