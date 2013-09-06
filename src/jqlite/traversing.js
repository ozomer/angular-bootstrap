'use strict';

angular.module('ngWidgets.bootstrap.jqlite.traversing', [])

  .factory('traversing', function($document, $window) {

    var proto = HTMLElement.prototype;
    var slice = Array.prototype.slice;
    var concat = Array.prototype.concat;
    var isString = angular.isString;
    var jqLite = angular.element;

    var fn = {};

    /**
     * Test the element nodeName
     * @param element
     * @param name
     */
    fn.nodeName = function(element, name) {
      return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
    };

    /**
     * QSA-powered jQuery's find function
     * @param element
     * @param prop
     * @param extra
     */
    fn.find = function(query, element) {
      return jqLite((element || document).querySelectorAll(query));
    };

    /**
     * Provides equivalent of jQuery's filter function
     * @required-by traversing.fn.parents
     * @url http://api.jquery.com/filter/
     * @param selector
     * @param elements
     * @param not
     */
    fn.filter = function(selector, elements, not) {
      var element = elements[0];
      if(not) {
        selector = ':not(' + selector + ')';
      }
      return elements.length === 1 ?
        matchesSelector(element, selector) ? [element] : [] :
        matches(selector, elements);
    };

    var matchesSelectorFn = proto.matchesSelector || proto.webkitMatchesSelector ||
                            proto.mozMatchesSelector || proto.oMatchesSelector;

    var matchesSelector = function(elem, selector) {
      return matchesSelectorFn.call(elem, selector);
    };

    var matches = function(selector, elems) {
      var matches = [];
      for(var i = 0, l = elems.length; i < l; i++) {
        var elem = elems[i];
        if(matchesSelector(elem, selector)) {
          matches.push(elem);
        }
      }
      return matches;
    };

    /**
     * Provides equivalent of jQuery's parents function
     * @required-by bootstrap-scrollspy
     * @url http://api.jquery.com/parents/
     * @param element
     * @param outer
     */
    fn.parents = function(element, selector) {
      var matched = concat.apply([], slice.call(element).map(parents));
      if (selector && isString(selector)) {
        matched = fn.filter(selector, matched);
      }
      return jqLite(matched);
    };

    var dir = function(element, dir, until) {
      var matched = [], truncate = until !== undefined;
      while ((element = element[dir]) && element.nodeType !== 9) {
        if (element.nodeType === 1) {
          if (truncate && element === until) {
            break;
          }
          matched.push(element);
        }
      }
      return matched;
    };

    var parents = function(element) {
      return dir(element, 'parentNode');
    };

    return fn;

  });
