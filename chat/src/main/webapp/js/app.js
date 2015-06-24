/* global require, requirejs */

requirejs.config({
    paths: {
        'angular': ['/javascript/angular.min'],
        'angular-route': ['/javascript/angular-route.min'],
        'jquery': ['/javascript/jquery-2.1.4.min'],
        'bootstrap': ['/javascript/bootstrap.min'],
        'atmosphere': ['/javascript/atmosphere-min'],
        'lodash':['/bower_components/lodash/lodash.min'],
        'angular-google-maps': ['/bower_components/angular-google-maps/dist/angular-google-maps.min']
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular'],
            exports: 'angular'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'lodash': {
            exports: 'lodash'
        },
        'angular-google-maps': {
            deps: ['angular', 'lodash']
        }
    }
});

require(['angular',
    'angular-route',
    'jquery',
    'bootstrap',
    'atmosphere',
    'lodash',
    'angular-google-maps',
    './services',
    './controllers'], function(angular) {
    'use strict';
    // Declare app level module which depends on filters, and services

    angular.module('myApp', [
        'ngRoute',
        'uiGmapgoogle-maps',
        'myApp.controllers',
        'myApp.services'
    ]).config(['$routeProvider', 'uiGmapGoogleMapApiProvider',
        function($routeProvider, uiGmapGoogleMapApiProvider) {
            $routeProvider.when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            });
            $routeProvider.when('/chat-room-choice', {
                templateUrl: 'partials/chat-room-choice.html',
                controller: 'ChatRoomChoiceController'
            });
            $routeProvider.when('/chat-room/:room', {
                templateUrl: 'partials/chat-room.html',
                controller: 'ChatRoomController'
            });
            $routeProvider.otherwise({
                redirectTo: '/login'
            });
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.17',
                libraries: 'weather,geometry,visualization'
            });
        }
    ]);

    angular.bootstrap(document, ['myApp']);

});
