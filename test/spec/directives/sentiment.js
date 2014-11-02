'use strict';

describe('Directive: sentiment', function () {

  // load the directive's module
  beforeEach(module('sosmApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sentiment></sentiment>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sentiment directive');
  }));
});
