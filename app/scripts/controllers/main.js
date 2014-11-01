'use strict';

/**
 * @ngdoc function
 * @name sosmApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sosmApp
 */
angular.module('sosmApp')
.controller('MainCtrl', function ($scope, $http) {
  $scope.collect = function() {
    $http.post('/api/collect', {search:$scope.search})
    .success(function(data) {
      console.log(data);
    });
  };
});
