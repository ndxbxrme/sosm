'use strict';

/**
 * @ngdoc directive
 * @name sosmApp.directive:sentiment
 * @description
 * # sentiment
 */
angular.module('sosmApp')
  .directive('sentiment', function () {
    return {
      templateUrl: 'views/sentiment.html',
      restrict: 'A',
      replace: true,
      scope: {
        sentiment: '='
      },
      link: function postLink() {
        //console.log(scope.sentiment);
      }
    };
  });
