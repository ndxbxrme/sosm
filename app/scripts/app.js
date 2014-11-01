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
  .run(function(){
    var colors = Please.make_scheme(Please.make_color({format:'hsv'}), {scheme_type:'double-complementary'});
    var style=document.createElement('style');
    style.type = 'text/css';
    var cssText = '.c0{color:' + colors[0] + '!important}.c1{color:' + colors[1] + '!important}.c2{color:' + colors[2] + '!important}.c3{color:' + colors[3] + '!important}.bg0{background-color:' + colors[0] + '!important}.bg1{background-color:' + colors[1] + '!important}.bg2{background-color:' + colors[2] + '!important}.bg3{background-color:' + colors[3] + '!important}.bo0{border-color:' + colors[0] + '!important}.bo1{border-color:' + colors[1] + '!important}.bo2{border-color:' + colors[2] + '!important}.bo3{border-color:' + colors[3] + '!important}a{color:' + colors[2] + '!important}';
    if(style.styleSheet) {
        style.styleSheet.cssText = cssText;   
    }else {
        style.appendChild(document.createTextNode(cssText));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  });
