'use strict';

angular.module('ngWidgets.bootstrap.buttons', [])

  .constant('buttonsConfig', {
    activeClass:'active',
    toggleEvent:'click'
  })

  .directive('wgCheckbox', function(buttonsConfig) {

    var isDefined = angular.isDefined;
    var activeClass = buttonsConfig.activeClass || 'active';
    var toggleEvent = buttonsConfig.toggleEvent || 'click';
    var constantValueRegExp = /^(true|false|\d+)$/;

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Support label > input[type="checkbox"]
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;

        var trueValue = isDefined(attr.trueValue) ? attr.trueValue : true;
        if(constantValueRegExp.test(attr.trueValue)) {
          trueValue = scope.$eval(attr.trueValue);
        }
        var falseValue = isDefined(attr.falseValue) ? attr.falseValue : false;
        if(constantValueRegExp.test(attr.falseValue)) {
          falseValue = scope.$eval(attr.falseValue);
        }

        // Parse exotic values
        var hasExoticValues = typeof trueValue !== 'boolean' || typeof falseValue !== 'boolean';
        if(hasExoticValues) {
          controller.$parsers.push(function(viewValue) {
            console.warn('$parser', element.attr('ng-model'), 'viewValue', viewValue);
            return viewValue ? trueValue : falseValue;
          });
          // Fix rendering for exotic values
          scope.$watch(attr.ngModel, function(newValue, oldValue) {
            controller.$render();
          });
        }

        // model -> view
        controller.$render = function () {
          console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var isActive = angular.equals(controller.$modelValue, trueValue);
          if(isInput) {
            element[0].checked = isActive;
          }
          activeElement.toggleClass(activeClass, isActive);
        };

        // view -> model
        element.bind(toggleEvent, function() {
          scope.$apply(function () {
            console.warn('!click', element.attr('ng-model'), 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue, 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue);
            if(!isInput) {
              controller.$setViewValue(!activeElement.hasClass('active'));
            }
            if(!hasExoticValues) {
              controller.$render();
            }
          });
        });

      }

    };

  })

  .directive('wgRadio', function buttonCheckbox(buttonsConfig) {

    var isDefined = angular.isDefined;
    var activeClass = buttonsConfig.activeClass || 'active';
    var toggleEvent = buttonsConfig.toggleEvent || 'click';
    var constantValueRegExp = /^(true|false|\d+)$/;

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Support label > input[type="radio"]
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;

        var value = constantValueRegExp.test(attr.value) ? scope.$eval(attr.value) : attr.value;
        console.warn('value', typeof value, value);

        // model -> view
        controller.$render = function () {
          console.warn('$render', element.attr('value'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var isActive = angular.equals(controller.$modelValue, value);
          console.warn('isActive', isActive);
          if(isInput) {
            element[0].checked = isActive;
          }
          activeElement.toggleClass(activeClass, isActive);
        };

        // view -> model
        element.bind(toggleEvent, function() {
          scope.$apply(function () {
            console.warn('!click', element.attr('value'), 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue, 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue);
            controller.$setViewValue(value);
            controller.$render();
          });
        });

      }

    };

  });
