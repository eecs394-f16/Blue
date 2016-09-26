angular
    .module('example', [
  // Declare here all AngularJS dependencies that are shared by the example module.
  'supersonic'
    ])
    .controller('IndexController', function($scope, supersonic) {
    // Controller functionality here
    $scope.getPosition = function() {
      supersonic.ui.dialog.alert("Interstellar!");
    };
  });
