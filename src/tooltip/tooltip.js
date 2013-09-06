'use strict';

angular.module('ngWidgets.bootstrap.tooltip', ['ngWidgets.bootstrap.jqlite.selector', 'ngWidgets.bootstrap.jqlite.dimensions'])

  .run(function($templateCache) {
    $templateCache.put('$tooltip', '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" ng-bind="content"></div></div>');
  })

  .provider('$tooltip', function() {

    var slice = Array.prototype.slice;
    var forEach = angular.forEach;
    var isUndefined = angular.isUndefined;
    var isNumber = angular.isNumber;
    var jqLite = angular.element;

    var defaults = this.defaults = {
      animation: 'fade',
      placement: 'top',
      // selector: false,
      template: '$tooltip',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      container: false
    };

    this.$get = function($window, $rootScope, $compile, $templateCache, $animate, selector, dimensions) {

      function TooltipFactory(element, config) {

        var $tooltip = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        var template = $templateCache.get(options.template);
        var scope = options.scope.$new() || $rootScope.$new();

        // Initial private vars
        var timeout, hoverState;

        // Compile directive element
        var tipElement = $compile(template)(scope);

        $tooltip.init = function() {

          // Set the initial positioning.
          tipElement.css({top: '0px', left: '0px', display: 'block'}).addClass(options.placement);

          // Options: animation
          options.animation && tipElement.addClass(options.animation);

          // Options: delay
          if (options.delay && isNumber(options.delay)) {
            options.delay = {
              show: options.delay,
              hide: options.delay
            };
          }

          // Options: trigger
          var triggers = options.trigger.split(' ');
          for (var i = triggers.length; i--;) {
            var trigger = triggers[i];
            if(trigger === 'click') {
              element.on('click', this.toggle);
            } else if(trigger !== 'manual') {
              element.on(trigger === 'hover' ? 'mouseenter' : 'focus', this.enter);
              element.on(trigger === 'hover' ? 'mouseleave' : 'blur', this.leave);
            }
          }

        };

        $tooltip.destroy = function() {

          // Unbind events
          var triggers = options.trigger.split(' ');
          for (var i = triggers.length; i--;) {
            var trigger = triggers[i];
            if(trigger === 'click') {
              element.off('click', this.toggle);
            } else if(trigger !== 'manual') {
              element.off(trigger === 'hover' ? 'mouseenter' : 'focus', this.enter);
              element.off(trigger === 'hover' ? 'mouseleave' : 'blur', this.leave);
            }
          }

          // Remove element
          tipElement.remove();

        };

        $tooltip.enter = function() {

          clearTimeout(timeout);
          hoverState = 'in';
          if (!options.delay || !options.delay.show) {
            return $tooltip.show();
          }

          timeout = setTimeout(function() {
            if (hoverState ==='in') $tooltip.show();
          }, options.delay.show);

        };

        $tooltip.show = function() {

          var parent = options.container ? selector.find(options.container) : null;
          var after = options.container ? null : element;
          $animate.enter(tipElement, parent, after, function() {
            tipElement.addClass('in');
          }, function() {
            $tooltip.$applyPlacement();
          });

        };

        $tooltip.leave = function() {

          clearTimeout(timeout);
          hoverState = 'out';
          if (!options.delay || !options.delay.hide) {
            return $tooltip.hide();
          }
          timeout = setTimeout(function () {
            if (hoverState === 'out') {
              $tooltip.hide();
            }
          }, options.delay.hide);

        };

        $tooltip.hide = function() {

          $animate.leave(tipElement, function() {
            tipElement.removeClass('in');
          });

        };

        $tooltip.toggle = function() {

          tipElement.hasClass('in') ? $tooltip.leave() : $tooltip.enter();

        };

        // Protected methods

        $tooltip.$applyPlacement = function() {

          // Get the position of the tooltip element.
          var elementPosition = dimensions.position(element[0]);

          // Get the height and width of the tooltip so we can center it.
          var tipWidth = tipElement.prop('offsetWidth'),
              tipHeight = tipElement.prop('offsetHeight');

          // Get the tooltip's top and left coordinates to center it with this directive.
          var tipPosition = getCalculatedOffset(options.placement, elementPosition, tipWidth, tipHeight);

          // Now set the calculated positioning.
          tipPosition.top += 'px';
          tipPosition.left += 'px';
          tipElement.css(tipPosition);

        };

        // Private methods

        function getCalculatedOffset(placement, position, actualWidth, actualHeight) {
          switch (placement) {
          case 'right':
            return {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left + position.width
            };
          case 'bottom':
            return {
              top: position.top + position.height,
              left: position.left + position.width / 2 - actualWidth / 2
            };
          case 'left':
            return {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left - actualWidth
            };
          default:
            return {
              top: position.top - actualHeight,
              left: position.left + position.width / 2 - actualWidth / 2
            };
          }
        }

        $tooltip.init();
        return $tooltip;

      }

      return TooltipFactory;

    };

  })

  .directive('wgTooltip', function($window, $location, $routeParams, $sce, $tooltip) {

    var forEach = angular.forEach;
    var isDefined = angular.isDefined;

    return {
      restrict: 'EAC',
      scope: true,
      // require: '?ngModel',
      // scope: { content: '=wgTooltip', prop: '=ngModel', placement: '@', animation: '&', isOpen: '&' },
      link: function postLink(scope, element, attr, transclusion) {

        // $sce.trustAsHtml(scope.content);
        console.warn('scope', scope);

        var options = {scope: scope};
        forEach(['placement', 'delay', 'trigger', 'animation'], function(key) {
          if(isDefined(attr[key])) options[key] = attr[key];
        });
        if(options.delay && angular.isString(options.delay)) {
          options.delay = parseFloat(options.delay);
        }

        // Watch wgTooltip for changes
        attr.$observe('wgTooltip', function(newValue, oldValue) {
          console.warn(oldValue, newValue);
        });

        var tooltip = $tooltip(element, options);
        scope.$on('$destroy', function() {
          options = null;
          tooltip = null;
        });

      }
    };

  });
