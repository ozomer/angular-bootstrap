'use strict';

angular.module('docs')

  .controller('ComponentsCtrl', function ($scope, $route, $routeParams) {

    angular.extend($scope, $routeParams);

    $scope.getMobileInclude = function() {
      return 'views/docs/' + ($routeParams.page || 'navbar-title') + '.html'; // + $scope.view;
    };

    $scope.components = [
      {
        id: 'navbar-title',
        title: 'Navbar title',
        description: 'Title bars are full width and docked to the top of the viewport.'
      },
      {
        id: 'navbar-title-with-buttons',
        title: 'Title bar with buttons',
        description: 'Buttons in a title bar are left or right aligned and should be used for actions.'
      },
      {
        id: 'navbar-title-with-directional-buttons',
        title: 'Title bar with directional buttons',
        description: 'Directional buttons in a title bar should be used for navigational purposes.'
      },
      {
        id: 'navbar-title-with-button-group',
        title: 'Title bar with segmented controller',
        description: 'Title bars can also house segmented controllers (with or without accompanying buttons). It all uses flex-box to create perfectly even spacing no matter their labels.'
      },
      {
        id: 'navbar-tab',
        title: 'Tab bar',
        description: 'Icons should be around 24px by 18px. The gradient on an icon starts with pure white and goes to #e5e5e5 at the bottom.'
      },
      {
        id: 'navbar-standard',
        title: 'Standard bars',
        description: 'Standard bars are basic fixed elements that can be positioned in 3 places. These can be used to house buttons or segmented controllers (see following examples).'
      },
      {
        id: 'list-group',
        title: 'List group',
        description: 'List groups can be used for organizing data, showing collections of links or a series of controls.'
      },
      {
        id: 'list-with-chevrons',
        title: 'List with chevrons',
        description: 'Chevrons are created with CSS3, so no image assets are needed. They should be used to indicate that the list item is linked.'
      },
      {
        id: 'list-with-badges',
        title: 'List with badges',
        description: ''
      },
      {
        id: 'list-with-badges-and-chevrons',
        title: 'List with badges and chevrons',
        description: ''
      },
      {
        id: 'list-with-buttons',
        title: 'List with buttons',
        description: ''
      },
      {
        id: 'list-inset',
        title: 'Inset list',
        description: ''
      },
      {
        id: 'buttons',
        title: 'Buttons',
        description: ''
      },
      {
        id: 'buttons-with-badges',
        title: 'Buttons with badges',
        description: ''
      },
      {
        id: 'buttons-block',
        title: 'Block buttons',
        description: ''
      },
      {
        id: 'badges',
        title: 'Badges',
        description: ''
      },
      {
        id: 'forms',
        title: 'Forms',
        description: ''
      },
      {
        id: 'forms-with-list-groups',
        title: 'Forms with list groups',
        description: ''
      },
      {
        id: 'forms-with-list-groups-and-labels',
        title: 'Forms with list groups and labels',
        description: ''
      },
      {
        id: 'popovers',
        title: 'Popovers',
        description: ''
      }
    ];

  });
