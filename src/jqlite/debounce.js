'use strict';

angular.module('ngWidgets.bootstrap.jqlite.debounce', [])

  .constant('debounce', function(fn, wait) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        result = fn.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      return result;
    };
  });
