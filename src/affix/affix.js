'use strict';

angular.module('ngWidgets.bootstrap.affix', ['ngWidgets.bootstrap.jqlite.dimensions'])

  .provider('$affix', function() {

    var jqLite = angular.element;

    var defaults = this.defaults = {
      offsetTop: 'auto'
    };

    this.$get = function($window, $timeout, dimensions) {

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
            unpin = null,
            offsetTop = 0,
            offsetBottom = 0;
        if(options.offsetTop && (options.offsetTop === 'auto' || options.offsetTop.match(/^[-+]\d+$/))) {
          initialAffixTop -= options.offsetTop * 1;
        }
        var parent = element.parent();
        if (options.offsetParent) {
          if (options.offsetParent.match(/^\d+$/)) {
            for (var i = 0; i < (options.offsetParent * 1) - 1; i++) {
              parent = parent.parent();
            }
          }
          else {
            parent = jqLite(options.offsetParent);
          }
        }

        $affix.updateOffsets = function() {
          if(options.offsetTop) {
            if(options.offsetTop === 'auto' || options.offsetTop.match(/^[-+]\d+$/)) {
              if(options.offsetParent) {
                offsetTop = dimensions.offset(parent[0]).top + (options.offsetTop * 1);              
              }
              else {
                offsetTop = dimensions.offset(element[0]).top - dimensions.css(element[0], 'marginTop', true) + (options.offsetTop * 1);
              }
            }
            else {
              offsetTop = options.offsetTop * 1;
            }
          }
          if(options.offsetBottom) {
            if(options.offsetParent && options.offsetBottom.match(/^[-+]\d+$/)) {
              // add 1 pixel due to rounding problems...
              offsetBottom = $window.document.body.scrollHeight - (dimensions.offset(parent[0]).top + dimensions.height(parent[0])) + (options.offsetBottom * 1) + 1;
            }
            else {
              offsetBottom = options.offsetBottom * 1;
            }
          }
        }

        $affix.init = function() {
          windowEl.ready(function() {
            $timeout(function() {
              // All initializations that are based on offsets and sizes should
              // be called only after the DOM is built.
              initialOffsetTop = dimensions.offset(element[0]).top + initialAffixTop;
              $affix.updateOffsets();
              
              // Bind events
              windowEl.on('scroll', $affix.checkPosition);
              windowEl.on('click', $affix.checkPosition);
            
              $affix.checkPosition();
            }, 1);
          });
        };
        
        $affix.destroy = function() {

          // Unbind events
          windowEl.off('scroll', $affix.checkPosition);
          windowEl.off('click', $affix.checkPosition);

        };

        $affix.checkPosition = function(is_second) {
          if (!is_second) {
            // Make every checkPosition call run twice.
            // Usefull in case the user jumps from the top of the page to the bottom.
            $timeout(function() { $affix.checkPosition(true) }, 1);
          }
          // if (!this.$element.is(':visible')) return

          var scrollTop = $window.pageYOffset;
          var position = dimensions.offset(element[0]);
          var elementHeight = dimensions.height(element[0]);

          // Get required affix class according to position
          var affix = getRequiredAffixClass(unpin, position, elementHeight);

          // Did affix status changed this last check?
          if(affixed === affix) return;
          affixed = affix;

          // Add proper affix class
          element.removeClass(reset).addClass('affix' + ((affix !== 'middle') ? '-' + affix : ''));

          if(affix === 'top') {
            unpin = null;
            element.css('position', (options.offsetParent) ? '' : 'relative');
            element.css('top', '');
          } else if(affix === 'bottom') {
            if (options.offsetUnpin) {
              unpin = -(options.offsetUnpin * 1);
            }
            else {
              // Calculate unpin threshold when affixed to bottom.
              // Hopefully the browser scrolls pixel by pixel.
              unpin = position.top - scrollTop;
            }
            element.css('position', (options.offsetParent) ? '' : 'relative');
            element.css('top', (options.offsetParent) ? '' : ((bodyEl[0].offsetHeight - offsetBottom - elementHeight - initialOffsetTop) + 'px'));
          } else { // affix === 'middle'
            unpin = null;
            element.css('position', 'fixed');
            element.css('top', initialAffixTop + 'px');
          }

        };

        // Private methods

        function getRequiredAffixClass(unpin, position, elementHeight) {

          var scrollTop = $window.pageYOffset;
          var scrollHeight = $window.document.body.scrollHeight;

          if(scrollTop <= offsetTop) {
            return 'top';
          } else if(unpin !== null && (scrollTop + unpin <= position.top)) {
            return 'middle';
          } else if(offsetBottom !== null && (position.top + elementHeight + initialAffixTop >= scrollHeight - offsetBottom)) {
            return 'bottom';
          } else {
            return 'middle';
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
        forEach(['offsetTop', 'offsetBottom', 'offsetParent', 'offsetUnpin'], function(key) {
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
