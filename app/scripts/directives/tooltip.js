'use strict';

/**
 * @ngdoc directive
 * @name sosmApp.directive:tooltip
 * @description
 * # tooltip
 */
angular.module('sosmApp')
  .directive('tooltip', function () {
    return {
      scope: {
        tooltip: '@' 
      },
      restrict: 'A',
      link: function postLink(scope, element) {
        element.addClass('tooltip');
        element.tooltipster({
          content: S(scope.tooltip).decodeHTMLEntities().s
        });
      }
    };
  });
