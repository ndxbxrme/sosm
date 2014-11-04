'use strict';

/**
 * @ngdoc service
 * @name sosmApp.Colours
 * @description
 * # Colours
 * Factory in the sosmApp.
 */
angular.module('sosmApp')
  .factory('Colours', function () {
    var colours = Please.make_scheme(Please.make_color({format:'hsv',hue:10}), {scheme_type:'double-complementary'});
    function generate(){
      var style=document.createElement('style');
      style.type = 'text/css';
      var cssText = '.c0{color:' + colours[0] + '!important}.c1{color:' + colours[1] + '!important}.c2{color:' + colours[2] + '!important}.c3{color:' + colours[3] + '!important}.bg1{background: ' + colours[1] + ' -webkit-linear-gradient(' + colours[1] + ',' + colours[0] + ')!important}.bg0{background-color:' + colours[1] + '!important}.bg2{background-color:' + colours[2] + '!important}.bg3{background-color:' + colours[3] + '!important}.bo0{border-color:' + colours[0] + '!important}.bo1{border-color:' + colours[1] + '!important}.bo2{border-color:' + colours[2] + '!important}.bo3{border-color:' + colours[3] + '!important}a{color:' + colours[2] + '!important}.green{background-color:#72bf7b!important}.red{background-color:#bf72a3!important}.grey{background-color:#cccccc!important}.morris-hover-row-label{color:' + colours[0] + '}';
      if(style.styleSheet) {
          style.styleSheet.cssText = cssText;   
      }else {
          style.appendChild(document.createTextNode(cssText));
      }
      document.getElementsByTagName('head')[0].appendChild(style);
    }
    return {
      colours: colours,
      generate: generate
    };
  });
