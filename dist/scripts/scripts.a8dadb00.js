"use strict";angular.module("sosmApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).run(["Colours",function(a){a.generate()}]),angular.module("sosmApp").controller("MainCtrl",["$scope","$http","$timeout","$filter","faces","Colours",function(a,b,c,d,e,f){function g(a,b,c,d,f){this.no=f,this.class=a,this.title=b,this.from=c,this.to=d,this.color="grey",this.polarity=0,this.count=0,this.lowest=10,this.highest=0,this.spread=0,this.negative=[],this.positive=[];var g=this;this.face="",this.update=function(){g.polarity=0!==g.count?Math.floor(g.polarity/g.count)+5:5,g.face=e[5],g.spread=g.highest-g.lowest,g.negative.length>g.positive.length?(g.face=e[0],g.color="red"):g.positive.length>g.negative.length&&(g.face=e[7],g.color="green")}}console.log(f.colours),a.pease=Please,a.collect=function(){-1===["searching","parsing"].indexOf(a.state)&&(a.state="searching",b.post("/api/collect",{search:a.search}).success(function(b){a.state="parsing",a.sentiments=[],c(function(){if(b&&b.length>0){var e=moment(Date.parse(b[0].created_at)),h=moment(Date.parse(b[b.length-1].created_at)),i=moment.duration(e.diff(h)).asHours(),j=Math.floor(i/6);a.sentiments.push(new g("overall","Overall",h.add(-1,"days"),moment(),0));for(var k=0;i>k;k+=j)a.sentiments.push(new g("default",$.timeago(moment().add(-k,"hours")._d),moment().add(-(k+j),"hours"),moment().add(-k,"hours"),k));angular.forEach(b,function(b){var c=moment(Date.parse(b.created_at));b.polarity=Math.max(-5,Math.min(5,b.polarity)),angular.forEach(a.sentiments,function(a){c.isAfter(a.from)&&c.isBefore(a.to)&&(b.polarity<-1?a.negative.push(b):b.polarity>1&&a.positive.push(b),isNaN(b.polarity)||(a.polarity+=b.polarity,b.polarity<a.lowest&&(a.lowest=b.polarity),b.polarity>a.highest&&(a.highest=b.polarity)),a.count++)})}),angular.forEach(a.sentiments,function(a){a.update()});for(var l=[],m=a.sentiments.length-1;m>0;m--)l.push({title:d("unambiguate")(a.sentiments[m].title),polarity:10*a.sentiments[m].polarity,lowest:10*(a.sentiments[m].lowest+5),highest:10*(a.sentiments[m].highest+5)});c(function(){new Morris.Line({element:"myfirstchart",data:l,xkey:"title",ykeys:["polarity","highest","lowest"],labels:["Happiness","Highest","Lowest"],lineColors:[f.colours[0],"#cccccc","#cccccc"],parseTime:!1,ymax:100,ymin:0,postUnits:"%",resize:!0})})}a.state="showingResult"})}))}}]),angular.module("sosmApp").constant("faces",[":(",":(",":(",":(",":|",":|",":)",":)",":)",":D",":D"]),angular.module("sosmApp").directive("tooltip",function(){return{scope:{tooltip:"@"},restrict:"A",link:function(a,b){b.addClass("tooltip"),b.tooltipster({content:S(a.tooltip).decodeHTMLEntities().s})}}}),angular.module("sosmApp").filter("unambiguate",function(){return function(a){return a.replace(/less than |more than |about /gi,"").replace("a minute ago","Now")}}),angular.module("sosmApp").directive("sentiment",function(){return{templateUrl:"views/sentiment.html",restrict:"A",replace:!0,scope:{sentiment:"="},link:function(){}}}),angular.module("sosmApp").factory("Colours",function(){function a(){var a=document.createElement("style");a.type="text/css";var c=".c0{color:"+b[0]+"!important}.c1{color:"+b[1]+"!important}.c2{color:"+b[2]+"!important}.c3{color:"+b[3]+"!important}.bg1{background: "+b[1]+" -webkit-linear-gradient("+b[1]+","+b[0]+")!important}.bg0{background-color:"+b[1]+"!important}.bg2{background-color:"+b[2]+"!important}.bg3{background-color:"+b[3]+"!important}.bo0{border-color:"+b[0]+"!important}.bo1{border-color:"+b[1]+"!important}.bo2{border-color:"+b[2]+"!important}.bo3{border-color:"+b[3]+"!important}a{color:"+b[2]+"!important}.green{background-color:#72bf7b!important}.red{background-color:#bf72a3!important}.grey{background-color:#bf9a72!important}.morris-hover-row-label{color:"+b[0]+"}";a.styleSheet?a.styleSheet.cssText=c:a.appendChild(document.createTextNode(c)),document.getElementsByTagName("head")[0].appendChild(a)}var b=Please.make_scheme(Please.make_color({format:"hsv",hue:10}),{scheme_type:"double-complementary"});return{colours:b,generate:a}});