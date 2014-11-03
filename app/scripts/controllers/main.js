'use strict';

/**
 * @ngdoc function
 * @name sosmApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sosmApp
 */
angular.module('sosmApp')
.controller('MainCtrl', function ($scope, $http, $timeout, $filter, faces, Colours) {
  console.log(Colours.colours);
  $scope.pease = Please;
  function Sentiment(_class, title, from, to, no){
    this.no = no;
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
      self.polarity = self.count!==0 ? Math.floor(self.polarity / self.count) + 5 : 5;
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
          var step = Math.floor(duration / 6);
          $scope.sentiments.push(new Sentiment('overall', 'Overall', dateOldest.add(-1, 'days'), moment(), 0));
          for(var f = 0; f<duration; f+=step) {
            $scope.sentiments.push(new Sentiment('default', $.timeago(moment().add(-f, 'hours')._d), moment().add(-(f+step), 'hours'), moment().add(-f, 'hours'), f));
          }
          angular.forEach(data, function(item){
            var date = moment(Date.parse(item.created_at));
            item.polarity = Math.max(-5, Math.min(5, item.polarity));
            angular.forEach($scope.sentiments, function(sentiment){
              if(date.isAfter(sentiment.from) && date.isBefore(sentiment.to)) {
                if(item.polarity < -1) {
                  sentiment.negative.push(item); 
                }
                else if(item.polarity > 1) {
                  sentiment.positive.push(item);        
                }
                if(!isNaN(item.polarity)) {
                  sentiment.polarity += item.polarity;
                  if(item.polarity < sentiment.lowest) {
                    sentiment.lowest = item.polarity; 
                  }
                  if(item.polarity > sentiment.highest) {
                    sentiment.highest = item.polarity; 
                  }
                }
                sentiment.count++;
              }
            });
          });
          angular.forEach($scope.sentiments, function(sentiment){
            sentiment.update();
          });
          var gdata = [];
          for(var i=$scope.sentiments.length-1;i>0;i--) {
            gdata.push({title:$filter('unambiguate')($scope.sentiments[i].title),polarity:$scope.sentiments[i].polarity * 10,lowest:($scope.sentiments[i].lowest + 5) * 10, highest:($scope.sentiments[i].highest + 5) * 10}); 
          }
          $timeout(function(){
            new Morris.Line({
                element: 'myfirstchart',
                data: gdata,
                xkey: 'title',
                ykeys: ['polarity', 'highest', 'lowest'],
                labels: ['Happiness','Highest','Lowest'],
                lineColors: [Colours.colours[0],'#cccccc','#cccccc'],
                parseTime: false,
                ymax:100,
                ymin:0,
                postUnits:'%',
                resize:true
              });
          });
        }
        $scope.state = 'showingResult';
      });

    });
  };
});
