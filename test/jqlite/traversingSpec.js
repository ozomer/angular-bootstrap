'use strict';

describe('jqlite.traversing', function () {

  var slice = Array.prototype.slice;
  var $compile, $q, scope, traversing;

  beforeEach(module('ngWidgets.bootstrap.jqlite.traversing'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$q_, _traversing_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    $q = _$q_;
    traversing = _traversing_;
  }));

  afterEach(function() {
    // scope.$destroy();
  });

  // Templates

  var templates = {
    'default': {
      element: '<div class="container"><div class="inner"><div class="btn btn-default">foo</div><div class="btn btn-primary">bar</div><div class="btn btn-warning">baz</div></div></div>'
    }
  };

  function compileDirective(template) {
    template = templates[template];
    var element = $(template.element);
    return jQuery(element[0]);
  }

  // Tests

  describe('fn.filter', function () {

    it('should correctly match jQuery output', function () {
      angular.forEach(templates, function(template, name) {
        var element = compileDirective(name).find('.btn');
        var actual, expected;
        actual = traversing.filter('.btn-primary', element.get());
        expected = element.filter('.btn-primary').get();
        expect(actual).toEquals(expected);
        actual = traversing.filter('.btn', element.get());
        expected = element.filter('.btn').get();
        expect(actual).toEquals(expected);
        actual = traversing.filter('.foo', element.get());
        expected = element.filter('.foo').get();
        expect(actual).toEquals(expected);
      });
    });

  });

  describe('fn.parents', function () {

    it('should correctly match jQuery output', function () {
      angular.forEach(templates, function(template, name) {
        var element = compileDirective(name).find('.btn-primary');
        var actual, expected;
        actual = traversing.parents(element.get());
        expected = element.parents();
        expect(actual[0]).toEquals(expected.get()[0]);
        actual = traversing.parents(element.get(), '.container');
        expected = element.parents('.container');
        expect(actual[0]).toEquals(expected.get()[0]);
        actual = traversing.parents(element.get(), '.foo');
        expected = element.parents('.foo');
        expect(actual[0]).toEquals(expected.get()[0]);
      });
    });

  });

});
