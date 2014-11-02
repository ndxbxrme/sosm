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
      $scope.sentiments = [];
      $timeout(function(){
        if(data && data.length > 0) {
          var dateNewest = moment(Date.parse(data[0].created_at));
          var dateOldest = moment(Date.parse(data[data.length-1].created_at));
          var duration = moment.duration(dateNewest.diff(dateOldest)).asHours();
          $scope.sentiments.push(new Sentiment('overall', 'Overall', dateOldest.add(-1, 'days'), moment()));
          if(duration < 12) {
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment()._d), moment().add(-15, 'minutes'), moment()));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-15, 'minutes')._d), moment().add(-30, 'minutes'), moment().add(-15, 'minutes')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-30, 'minutes')._d), moment().add(-45, 'minutes'), moment().add(-30, 'minutes')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-45, 'minutes')._d), moment().add(-60, 'minutes'), moment().add(-45, 'minutes')));
          }
          else if(duration < 24) {
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment()._d), moment().add(-2, 'hours'), moment()));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-2, 'hours')._d), moment().add(-4, 'minutes'), moment().add(-2, 'hours')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-4, 'hours')._d), moment().add(-6, 'minutes'), moment().add(-4, 'hours')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-6, 'hours')._d), moment().add(-8, 'minutes'), moment().add(-6, 'hours')));
          }
          else if(duration < 48) {
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment()._d), moment().add(-6, 'hours'), moment()));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-6, 'hours')._d), moment().add(-12, 'hours'), moment().add(-6, 'hours')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-12, 'hours')._d), moment().add(-18, 'hours'), moment().add(-12, 'hours')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-18, 'hours')._d), moment().add(-24, 'hours'), moment().add(-18, 'hours')));            
          }
          else if(duration < 168) {
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment()._d), moment().add(-12, 'hours'), moment()));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-12, 'hours')._d), moment().add(-24, 'hours'), moment().add(-12, 'hours')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-24, 'hours')._d), moment().add(-36, 'hours'), moment().add(-24, 'hours')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-36, 'hours')._d), moment().add(-48, 'hours'), moment().add(-36, 'hours')));    
            
          }
          else if(duration < 336) {
            $scope.sentiments.push(new Sentiment('overall', 'today', moment().add(-1, 'days'), moment()));
            $scope.sentiments.push(new Sentiment('overall', 'yesterday', moment().add(-2, 'days'), moment().add(-1, 'days')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-2, 'days')._d), moment().add(-3, 'days'), moment().add(-2, 'days')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-3, 'days')._d), moment().add(-4, 'days'), moment().add(-3, 'days'))); 
          }
          else {
            $scope.sentiments.push(new Sentiment('overall', 'today', moment().add(-1, 'days'), moment()));
            $scope.sentiments.push(new Sentiment('overall', 'yesterday', moment().add(-2, 'days'), moment().add(-1, 'days')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-2, 'days')._d), moment().add(-3, 'days'), moment().add(-2, 'days')));
            $scope.sentiments.push(new Sentiment('overall', $.timeago(moment().add(-3, 'days')._d), moment().add(-4, 'days'), moment().add(-3, 'days')));             
          }
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
          console.log(dateNewest.format());
          console.log(dateOldest.format());
        }
        $scope.state = 'showingResult';
      });

    });
  };
});
