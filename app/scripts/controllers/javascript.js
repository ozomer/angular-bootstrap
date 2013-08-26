'use strict';

angular.module('docs')

  .controller('JavascriptCtrl', function ($scope, $route, $location, $routeParams) {

    angular.extend($scope, $routeParams);

    $scope.getMobileInclude = function() {
      return 'views/mobile/' + ($routeParams.page || 'master') + '.html'; // + $scope.view;
    };

    // $scope.$navigate.path = function(path, animation, reverse) {
    //   $scope.$navigate.search('page', path.substr(1), animation, reverse);
    // };

    $scope.components = [
    ];

    // $scope.$navigate = function(location) {
    //   $location.search('page', location);
    //   console.warn('$navigate', $location.path(), $location.hash());
    // };

    // $scope.$navigate.animation = 'slide';


  });

angular.module('mobile', [])

  .config(function ($routeProvider) {

    $routeProvider
      .when('/getting-started', {
        templateUrl: 'views/getting-started.html',
        headerUrl: 'views/layout/header.html',
        headerTitle: 'Getting started',
        headerBody: 'An overview of Bootstrap, how to download and use, basic templates and examples, and more.',
        reloadOnSearch: false
      })
      .when('/styles', {
        controller: 'ComponentsCtrl',
        templateUrl: 'views/styles.html',
        headerUrl: 'views/layout/header.html',
        headerTitle: 'Styles',
        headerBody: 'Fundamental HTML elements styled and enhanced with extensible classes.',
        reloadOnSearch: false
      })
      .when('/javascript', {
        controller: 'JavascriptCtrl',
        templateUrl: 'views/javascript.html',
        headerUrl: 'views/layout/header.html',
        headerTitle: 'Javascript',
        headerBody: 'Bring components to life with over a dozen custom AngularJS plugins.',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/getting-started'
      });

  })
