"use strict";angular.module("sosmApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).run(function(){var a=Please.make_scheme(Please.make_color({format:"hsv",hue:10}),{scheme_type:"double-complementary"}),b=document.createElement("style");b.type="text/css";var c=".c0{color:"+a[0]+"!important}.c1{color:"+a[1]+"!important}.c2{color:"+a[2]+"!important}.c3{color:"+a[3]+"!important}.bg1{background: "+a[1]+" -webkit-linear-gradient("+a[1]+","+a[0]+")!important}.bg0{background-color:"+a[1]+"!important}.bg2{background-color:"+a[2]+"!important}.bg3{background-color:"+a[3]+"!important}.bo0{border-color:"+a[0]+"!important}.bo1{border-color:"+a[1]+"!important}.bo2{border-color:"+a[2]+"!important}.bo3{border-color:"+a[3]+"!important}a{color:"+a[2]+"!important}.green{background-color:#72bf7b!important}.red{background-color:#bf72a3!important}.grey{background-color:#bf9a72!important}";b.styleSheet?b.styleSheet.cssText=c:b.appendChild(document.createTextNode(c)),document.getElementsByTagName("head")[0].appendChild(b)}),angular.module("sosmApp").controller("MainCtrl",["$scope","$http","$timeout","faces",function(a,b,c,d){function e(a,b,c,e){this.class=a,this.title=b,this.from=c,this.to=e,this.color="grey",this.polarity=0,this.count=0,this.lowest=10,this.highest=0,this.spread=0,this.negative=[],this.positive=[];var f=this;this.face="",this.update=function(){f.polarity=0!==f.count?Math.floor(f.polarity/f.count)+5:5,f.face=d[5],f.spread=f.highest-f.lowest,f.negative.length>f.positive.length?(f.face=d[0],f.color="red"):f.positive.length>f.negative.length&&(f.face=d[7],f.color="green")}}a.pease=Please,a.collect=function(){-1===["searching","parsing"].indexOf(a.state)&&(a.state="searching",b.post("/api/collect",{search:a.search}).success(function(b){a.state="parsing",a.sentiments=[],c(function(){if(b&&b.length>0){var c=moment(Date.parse(b[0].created_at)),d=moment(Date.parse(b[b.length-1].created_at)),f=moment.duration(c.diff(d)).asHours(),g=Math.floor(f/6);a.sentiments.push(new e("overall","Overall",d.add(-1,"days"),moment()));for(var h=0;f>h;h+=g)a.sentiments.push(new e("default",$.timeago(moment().add(-h,"hours")._d),moment().add(-(h+g),"hours"),moment().add(-h,"hours")));angular.forEach(b,function(b){var c=moment(Date.parse(b.created_at));b.polarity=Math.max(-5,Math.min(5,b.polarity)),angular.forEach(a.sentiments,function(a){c.isAfter(a.from)&&c.isBefore(a.to)&&(b.polarity<0?a.negative.push(b):b.polarity>0&&a.positive.push(b),isNaN(b.polarity)||(a.polarity+=b.polarity,b.polarity<a.lowest&&(a.lowest=b.polarity),b.polarity>a.highest&&(a.highest=b.polarity)),a.count++)})}),angular.forEach(a.sentiments,function(a){a.update()}),console.log(c.format()),console.log(d.format())}a.state="showingResult"})}))}}]),angular.module("sosmApp").constant("faces",[":(",":(",":(",":(",":|",":|",":)",":)",":)",":D",":D"]),angular.module("sosmApp").directive("tooltip",function(){return{scope:{tooltip:"@"},restrict:"A",link:function(a,b){b.addClass("tooltip"),b.tooltipster({content:S(a.tooltip).decodeHTMLEntities().s})}}}),angular.module("sosmApp").filter("unambiguate",function(){return function(a){return a.replace(/less than |more than |about /gi,"")}});