'use strict';

/**
 * @ngdoc overview
 * @name sosmApp
 * @description
 * # sosmApp
 *
 * Main module of the application.
 */
angular
  .module('sosmApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  })
  .run(function(Colours){
    Colours.generate();
  });
