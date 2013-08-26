'use strict';

angular.module('mgcrea.includeCode', [])

  .directive('ngIncludeCode', function($http, $templateCache, $compile) {

    var jqLite = angular.element;

    return {
      restrict: 'EAC',
      terminal: true,
      compile: function compile(tElement, tAttrs) {
        var srcExp = tAttrs.ngIncludeCode || tAttrs.src;

        return function postLink(scope, iElement, iAttrs) {
          var changeCounter = 0,
              childScope;

          var clearContent = function() {
            if (childScope) {
              childScope.$destroy();
              childScope = null;
            }
          };

          scope.$watch(srcExp, function ngIncludeWatchAction(src) {

            var thisChangeId = ++changeCounter;

            if (src) {
              $http.get(src, {cache: $templateCache}).success(function(response) {
                if (thisChangeId !== changeCounter) return;

                if (childScope) childScope.$destroy();
                childScope = scope.$new();

                var contents = jqLite('<div/>').text(response.trim()).contents();
                $compile(contents)(childScope);
                window.hljs.highlightBlock(iElement[0]);

                childScope.$emit('$includeContentLoaded');
              }).error(function() {
                if (thisChangeId === changeCounter) clearContent();
              });
              scope.$emit('$includeContentRequested');
            } else {
              clearContent();
            }
          });
        };
      }
    };

  });
