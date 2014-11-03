'use strict';

describe('Service: Colours', function () {

  // load the service's module
  beforeEach(module('sosmApp'));

  // instantiate service
  var Colours;
  beforeEach(inject(function (_Colours_) {
    Colours = _Colours_;
  }));

  it('should do something', function () {
    expect(!!Colours).toBe(true);
  });

});
