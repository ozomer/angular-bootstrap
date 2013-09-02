'use strict';

var jqLite = angular.element;
var isDefined = angular.isDefined;

angular.module('docs', ['ngRoute', 'ngAnimate', 'ngWidgets.bootstrap'])

  // .config(function ($routeProvider, $locationProvider) {

  //   $routeProvider
  //     .when('/getting-started', {
  //       templateUrl: 'views/getting-started.html',
  //       headerUrl: 'views/layout/header.html',
  //       headerTitle: 'Getting started',
  //       headerBody: 'An overview of Bootstrap, how to download and use, basic templates and examples, and more.',
  //       reloadOnSearch: false
  //     })
  //     .when('/components', {
  //       controller: 'ComponentsCtrl',
  //       templateUrl: 'views/components.html',
  //       headerUrl: 'views/layout/header.html',
  //       headerTitle: 'Components',
  //       headerBody: 'Over a dozen reusable components built to provide iconography, dropdowns, navigation, alerts, popovers, and much more.',
  //       reloadOnSearch: false
  //     })
  //     .when('/javascript', {
  //       controller: 'JavascriptCtrl',
  //       templateUrl: 'views/javascript.html',
  //       headerUrl: 'views/layout/header.html',
  //       headerTitle: 'Javascript',
  //       headerBody: 'Bring components to life with over a dozen custom AngularJS plugins.',
  //       reloadOnSearch: false
  //     })
  //     .otherwise({
  //       redirectTo: '/getting-started'
  //     });

  //     // $locationProvider.hashPrefix('!');

  // })


  .directive('wgCodeExample', function($window) {

    var jqLite = angular.element;
    var concat = Array.prototype.concat;
    var slice = Array.prototype.slice;

    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#x2F;'
    };

    function escapeHtml(string) {
      return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
      });
    }

    return {
      restrict: 'EAC',
      compile: function postLink(element, attr) {

        var children = slice.call(element[0].childNodes)
        .filter(function(child) {
          return child.outerHTML && child.nodeName.toLowerCase() !== 'pre';
        }).map(function(child) {
          return escapeHtml(child.outerHTML);
        });

        var pre = children.join('');

        // Remove closing tag indentation to every line
        if(pre.indexOf('\n') !== -1) {
          var ws = pre.split('\n').pop().indexOf('&lt;');
          var s = ''; while(ws--) s+=' ';
          var p = new RegExp('\n' + s, ['g']);
          pre = pre.replace(p, '\n');
        }

        pre = pre.replace(/=&quot;&quot;/g, '');
        pre = pre.replace(/\n/g, '<br>');
        pre = pre.replace(/  /g, '&nbsp;&nbsp;');

        var highlighted = jqLite('<div class="highlight"></div>').html('<pre>' + pre + '</pre>');
        $window.hljs && $window.hljs.highlightBlock(highlighted[0], null, true);
        element.after(highlighted);

      }
    };

  })

  .run(function($rootScope, $location, $anchorScroll, $routeParams, $route, debounce) {

    $rootScope.getRouteParam = function(param) {
      if(!$route.current || ! $route.current.$$route) return;
      return $route.current.$$route[param];
    };

    var $scope = $rootScope;//.$new();

    // Tooltip
    $scope.tooltip = {title: 'Hello Tooltip<br />This is a multiline message!', checked: false};

    // Buttons
    $scope.button = {active: true};
    $scope.buttonSelect = {currency: '¥'};
    $scope.checkbox = {left: false, middle: true, right: false};
    $scope.radio = {value: 'middle'};

    // var debouncedScroll = debounce(function() {
    //   var elm = document.getElementById($routeParams.page);
    //   if(elm) elm.scrollIntoView();
    // }, 300);

    // // $rootScope.$on('$includeContentLoaded', debouncedScroll);
    // $rootScope.$on('$viewContentLoaded', debouncedScroll);
    // $rootScope.$on('$routeChangeSuccess', function(ev, newRoute) {
    //   console.warn('$routeChangeSuccess', newRoute.$$route.headerUrl);
    // });

  });


// FastClick
window.addEventListener('load', function() {
  new FastClick(document.body);
}, false);
