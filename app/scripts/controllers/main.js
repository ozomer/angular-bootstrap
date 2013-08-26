'use strict';

angular.module('docs')

  .controller('MainCtrl', function ($scope, $route, $routeParams) {

    angular.extend($scope, $routeParams);

  });
