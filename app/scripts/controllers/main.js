'use strict';

/**
 * @ngdoc function
 * @name sosmApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sosmApp
 */
angular.module('sosmApp')
.controller('MainCtrl', function ($scope, $http, $timeout, faces) {
  $scope.pease = Please;
  function Sentiment(_class, title, from, to){
    this.class = _class;
    this.title = title;
    this.from = from;
    this.to = to;
    this.color = 'grey';
    this.polarity = 0;
    this.count = 0;
    this.lowest = 10;
    this.highest = 0;
    this.spread = 0;
    this.negative = [];
    this.positive = [];
    var self = this;
    this.face =  '';
    this.update = function(){
      self.polarity = Math.floor(self.polarity / self.count) + 5;
      self.face = faces[5];
      self.spread = self.highest - self.lowest;
      if(self.negative.length > self.positive.length) {
        self.face = faces[0]; 
        self.color = 'red';
      }
      else if(self.positive.length > self.negative.length) {
        self.face = faces[7]; 
        self.color = 'green';
      }
    };
  }
  $scope.collect = function() {
    if(['searching','parsing'].indexOf($scope.state)!==-1) {
      return; 
    }
    $scope.state = 'searching';
    $http.post('/api/collect', {search:$scope.search})
    .success(function(data) {
      $scope.state = 'parsing';
      $scope.sentiments = [
        new Sentiment('overall', 'Overall', moment().add(-1, 'years'), moment()),
        new Sentiment('today', 'Today', moment().add(-1, 'days'), moment()),
        new Sentiment('yesterday', 'Yesterday', moment().add(-2, 'days'), moment().add(-1, 'days'))
      ];
      $timeout(function(){
        if(data && data.length > 0) {
          $scope.alltime = new Sentiment();
          angular.forEach(data, function(item){
            var date = moment(Date.parse(item.created_at));
            item.polarity = Math.max(-5, Math.min(5, item.polarity));
            angular.forEach($scope.sentiments, function(sentiment){
              if(date.isAfter(sentiment.from) && date.isBefore(sentiment.to)) {
                if(item.polarity < 0) {
                  sentiment.negative.push(item); 
                }
                else if(item.polarity > 0) {
                  sentiment.positive.push(item);        
                }
                sentiment.polarity += item.polarity;
                if(item.polarity < sentiment.lowest) {
                  sentiment.lowest = item.polarity; 
                }
                if(item.polarity > sentiment.highest) {
                  sentiment.highest = item.polarity; 
                }
                sentiment.count++;
              }
            });
          });
          angular.forEach($scope.sentiments, function(sentiment){
            sentiment.update();
          });
          var dateNewest = moment(Date.parse(data[0].created_at));
          var dateOldest = moment(Date.parse(data[data.length-1].created_at));
          console.log(dateNewest.format());
          console.log(dateOldest.format());
        }
        $scope.state = 'showingResult';
      });

    });
  };
});
