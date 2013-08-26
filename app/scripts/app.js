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

  .run(function($rootScope, $location, $anchorScroll, $routeParams, $route, debounce) {

    $rootScope.getRouteParam = function(param) {
      if(!$route.current || ! $route.current.$$route) return;
      return $route.current.$$route[param];
    };

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
