'use strict';

angular.module('ngWidgets.bootstrap.scrollspy', ['ngWidgets.bootstrap.jqlite.selector', 'ngWidgets.bootstrap.jqlite.debounce', 'ngWidgets.bootstrap.jqlite.dimensions', 'ngWidgets.bootstrap.jqlite.traversing'])

  .provider('$scrollspy', function() {

    var slice = Array.prototype.slice;
    var forEach = angular.forEach;
    var isUndefined = angular.isUndefined;
    var isArray = angular.isArray;
    var jqLite = angular.element;

    var defaults = this.defaults = {
      offset: 10
    };

    this.$get = function($window, $rootScope, selector, dimensions, traversing, debounce) {

      var windowEl = jqLite($window);
      var bodyEl = jqLite($window.document.body);
      var nodeName = selector.nodeName;

      function ScrollSpyFactory(config) {

        var $scrollspy = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        var scope = options.scope.$new() || $rootScope.$new();
        var scrollspy = options.element ? options.element : bodyEl;
        var scrollElement = nodeName(scrollspy[0], 'body') ? windowEl : scrollspy;

        // Initial private vars
        var offsets = null,
            targets = null,
            activeTarget = null;
        // var offset;

        // Options: target
        var targetSelector = options.target + ' .nav li > a';

        // Debounced refresh
        var debouncedRefresh = debounce($scrollspy.$refreshPositions, 300);

        $scrollspy.init = function() {

          // Bind events
          scrollElement.on('scroll', this.process);

          // Debounce scrollspy after content loading
          scope.$on('$viewContentLoaded', debouncedRefresh);
          scope.$on('$includeContentLoaded', debouncedRefresh);

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
          var targetElements = selector.find(targetSelector, bodyEl[0]);

          slice.call(targetElements)
          .map(function(element) {
            element = jqLite(element);
            var href = element.data('target') || element.attr('href');
            var targetElement = /^#\w/.test(href) && selector.find(href);
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

          // if(options.offset) {
          //   // auto to offset of 1?
          //   offset = isUndefined(options.offset) ? offsets.length && offsets[0] : options.offset * 1;
          // }

        };

        $scrollspy.process = function() {

          if(!offsets.length) return;

          var scrollTop = scrollspy[0].scrollTop + options.offset;
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
              this.activate(targets[i]);
            }
          }
        };

        $scrollspy.activate = function(target) {

          // Save active target for process()
          activeTarget = target;

          // Toggle active class on elements @ratchet-like implementation
          // selector.find(options.target + ' > .active').removeClass('active');
          // selector.find('#' + activeTarget).addClass('active');

          // Remove active class to navigation links
          var source = traversing.parents(selector.find(targetSelector), '.active').removeClass('active');

          // Add active class to matched navigation links
          var selectorString = targetSelector + '[data-target="' + target + '"],' + targetSelector + '[href="' + target + '"]';
          var active = traversing.parents(selector.find(selectorString), 'li').addClass('active');

        };

        $scrollspy.init();
        return $scrollspy;

      }

      return ScrollSpyFactory;

    };

  })

  .directive('wgScrollspy', function($window, $location, $routeParams, $scrollspy) {

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

      }
    };

  });
