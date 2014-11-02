'use strict';

describe('Service: faces', function () {

  // load the service's module
  beforeEach(module('sosmApp'));

  // instantiate service
  var faces;
  beforeEach(inject(function (_faces_) {
    faces = _faces_;
  }));

  it('should do something', function () {
    expect(!!faces).toBe(true);
  });

});
