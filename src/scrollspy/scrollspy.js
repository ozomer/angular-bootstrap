'use strict';

angular.module('ngWidgets.bootstrap.scrollspy', ['ngWidgets.bootstrap.jqlite.debounce', 'ngWidgets.bootstrap.jqlite.dimensions', 'ngWidgets.bootstrap.jqlite.traversing'])

  .provider('$scrollspy', function() {

    var slice = Array.prototype.slice;
    var forEach = angular.forEach;
    var isUndefined = angular.isUndefined;
    var isArray = angular.isArray;
    var jqLite = angular.element;

    var defaults = this.defaults = {
      offset: 10
    };

    this.$get = function($window, $rootScope, dimensions, traversing, debounce) {

      var windowEl = jqLite($window);
      var bodyEl = jqLite($window.document.body);
      var nodeName = traversing.nodeName;

      function ScrollSpyFactory(config) {

        var $scrollspy = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        var scope = options.scope.$new() || $rootScope.$new();
        var scrollspy = options.element ? options.element : bodyEl;
        var scrollElement = nodeName(scrollspy[0], 'body') ? windowEl : scrollspy;

        // Initial private vars
        var offsets = [],
            targets = [],
            activeTarget = null,
            offset = null;

        // Options: target
        var targetSelector = options.target || '.nav li > a';

        // Debounced refresh
        var debouncedRefresh;

        $scrollspy.init = function() {

          // Bind events
          scrollElement.on('scroll', this.process);

          // Debounce scrollspy after content loading
          debouncedRefresh = debounce(this.$refreshPositions.bind(this), 300);
          $rootScope.$on('$viewContentLoaded', debouncedRefresh);
          $rootScope.$on('$includeContentLoaded', debouncedRefresh);

        };

        $scrollspy.destroy = function() {

          // Unbind events
          scrollElement.off('scroll', this.process);

        };

        $scrollspy.$refreshPositions = function() {
          this.refresh();
          this.process();
        };

        $scrollspy.refresh = function() {

          offsets = [];
          targets = [];

          // var offsetMethod = scrollspy[0] == window ? 'offset' : 'position'
          var targetElements = traversing.find(targetSelector, bodyEl[0]);

          slice.call(targetElements)
          .map(function(element) {
            element = jqLite(element);
            var href = element.data('target') || element.attr('data-target') || element.attr('href');
            var targetElement = /^#\w/.test(href) && traversing.find(href);
            // If href not found, activate self
            if(!targetElement && element.attr('id')) {
              href = element.attr('id');
              targetElement = element;
            }
            if(!targetElement || !targetElement.length) return null;
            return [dimensions.offset(targetElement[0]).top, href];
          })
          .filter(function(a) {
            return isArray(a);
          })
          .sort(function(a, b) {
            return a[0] - b[0];
          })
          .forEach(function(el) {
            offsets.push(el[0]);
            targets.push(el[1]);
          });

          // Add support for offset option
          offset = options.offset === 'auto' ? offsets.length && offsets[0] : options.offset * 1;

        };

        $scrollspy.process = function() {

          if(!offsets.length) return;

          var scrollTop = scrollspy[0].scrollTop + offset;
          var scrollHeight = scrollspy[0].scrollHeight || bodyEl[0].scrollHeight;
          // var maxScroll = scrollHeight - jqHeight(el[0]);
          // console.warn(scrollTop, scrollHeight);

          if(scrollTop < offsets[0] && activeTarget !== targets[0]) {
            return this.activate(targets[0]);
          }
          // if(scrollTop > maxScroll) {
          //   // return activate(scope, targets[0]);
          // }
          for (var i = offsets.length; i--;) {
            if(activeTarget !== targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1])) {
              $scrollspy.activate(targets[i]);
            }
          }
        };

        $scrollspy.activate = function(target) {

          // Save active target for process()
          activeTarget = target;

          var source = traversing.find(targetSelector);
          var selectorString = targetSelector + '[data-target="' + target + '"], ' + targetSelector + '[href="' + target + '"], ' + target;
          var selected = traversing.find(selectorString);

          if(selected.attr('id') === target) {
            // Remove/Add active class to matched id
            source.removeClass('active');
            selected.addClass('active');
          } else {
            // Remove/Add active class to matched navigation links
            traversing.parents(source, '.active').removeClass('active');
            traversing.parents(selected, 'li').addClass('active');
          }

          // Emit activation event
          scope.$emit('$scrollspy.activate', target);

        };

        $scrollspy.init();
        return $scrollspy;

      }

      return ScrollSpyFactory;

    };

  })

  .directive('wgScrollspy', function($parse, $scrollspy) {

    var forEach = angular.forEach,
        isDefined = angular.isDefined;

    return {
      restrict: 'EAC',
      link: function postLink(scope, element, attr) {

        var options = {scope: scope, element: element};
        forEach(['offset', 'target'], function(key) {
          if(isDefined(attr[key])) options[key] = attr[key];
        });

        var scrollspy = $scrollspy(options);
        scope.$on('$destroy', function() {
          options = null;
          scrollspy = null;
        });

        var fn = $parse(attr.wgScrollspy);
        scope.$on('$scrollspy.activate', function(event, target) {
          fn(scope, {$target:target});
        });

      }
    };

  });
