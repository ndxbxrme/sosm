'use strict';

/**
 * @ngdoc filter
 * @name sosmApp.filter:unambiguate
 * @function
 * @description
 * # unambiguate
 * Filter in the sosmApp.
 */
angular.module('sosmApp')
  .filter('unambiguate', function () {
    return function (input) {
      return input.replace(/less than |more than |about /gi,'').replace('a minute ago', 'Now');
    };
  });
