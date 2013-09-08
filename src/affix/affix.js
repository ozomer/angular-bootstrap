'use strict';

angular.module('ngWidgets.bootstrap.affix', ['ngWidgets.bootstrap.jqlite.dimensions'])

  .provider('$affix', function() {

    var jqLite = angular.element;

    var defaults = this.defaults = {
      offsetTop: 'auto'
    };

    this.$get = function($window, dimensions) {

      var windowEl = jqLite($window);
      var bodyEl = jqLite($window.document.body);

      function AffixFactory(element, config) {

        var $affix = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        // Initial private vars
        var reset = 'affix affix-top affix-bottom',
            initialAffixTop = 0,
            initialOffsetTop = 0,
            affixed = null,
            unpin = null;

        // Options: offsets
        if(options.offsetTop === 'auto' || options.offsetTop[0].match(/^[-+]/)) {
          var offsetTop = options.offsetTop;
          options.offsetTop = dimensions.offset(element[0]).top - dimensions.css(element[0], 'marginTop', true);
          if(offsetTop[0] === '-') {
            options.offsetTop -= offsetTop.substr(1) * 1;
            initialAffixTop += offsetTop.substr(1) * 1;
          } else if(offsetTop[0] === '+') {
            options.offsetTop += offsetTop.substr(1) * 1;
            initialAffixTop -= offsetTop.substr(1) * 1;
          }
        }

        var offsetTop = options.offsetTop ? options.offsetTop * 1 : 0,
            offsetBottom = options.offsetBottom ? options.offsetBottom * 1 : 0;

        $affix.init = function() {

          initialOffsetTop = dimensions.offset(element[0]).top + initialAffixTop;

          // Bind events
          windowEl.on('scroll', this.checkPosition);
          windowEl.on('click', this.checkPositionWithEventLoop);
          this.checkPosition();

        };

        $affix.destroy = function() {

          // Unbind events
          windowEl.off('scroll', this.checkPosition);
          windowEl.off('click', this.checkPositionWithEventLoop);

        };

        $affix.checkPositionWithEventLoop = function() {

          setTimeout(this.checkPosition, 1);

        };

        $affix.checkPosition = function() {
          // if (!this.$element.is(':visible')) return

          var scrollTop = $window.pageYOffset;
          var position = dimensions.offset(element[0]);
          var elementHeight = dimensions.height(element[0]);

          // Get required affix class according to position
          var affix = getRequiredAffixClass(unpin, position, elementHeight);

          // Did affix status changed this last check?
          if(affixed === affix) return;
          affixed = affix;

          // We should unpin?
          if(unpin) element.css('top', '');

          // Add proper affix class
          element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''));

          if(affix === 'top') {
            unpin = null;
            element.css('position', 'relative');
            element.css('top', '');
          } else if(affix === 'bottom') {
            // Calculate unpin threshold when affixed to bottom
            unpin = position.top - scrollTop;
            element.css('position', 'relative');
            element.css('top', (bodyEl[0].offsetHeight - offsetBottom - elementHeight - initialOffsetTop) + 'px');
          } else {
            unpin = null;
            if(initialAffixTop) {
              element.css('position', 'fixed');
              element.css('top', initialAffixTop + 'px');
            }
          }

        };

        // Private methods

        function getRequiredAffixClass(unpin, position, elementHeight) {

          var scrollTop = $window.pageYOffset;
          var scrollHeight = $window.document.body.scrollHeight;

          if(scrollTop <= offsetTop) {
            return 'top';
          } else if(unpin !== null && (scrollTop + unpin <= position.top)) {
            return false;
          } else if(offsetBottom !== null && (position.top + elementHeight + initialAffixTop >= scrollHeight - offsetBottom)) {
            return 'bottom';
          } else {
            return false;
          }

        }

        $affix.init();
        return $affix;

      }

      return AffixFactory;

    };

  })

  .directive('wgAffix', function($affix, dimensions) {

    var forEach = angular.forEach;
    var isDefined = angular.isDefined;
    var jqLite = angular.element;

    return {
      restrict: 'EAC',
      link: function postLink(scope, element, attr) {

        var options = {scope: scope, offsetTop: 'auto'};
        forEach(['offsetTop', 'offsetBottom'], function(key) {
          if(isDefined(attr[key])) options[key] = attr[key];
        });

        var affix = $affix(element, options);
        scope.$on('$destroy', function() {
          options = null;
          affix = null;
        });

      }
    };

  });
