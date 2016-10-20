angular
  .module('rental')
  .controller('myAccountController', function ($scope) {
      $scope.loadProfile = function () {
          $scope.account = { 'name': 'Brian Walker', 'location': 'Evanston, IL', 'email': 'brian@nu.com', 'number': '(123) 567-789', 'description': 'I have many things to rent out' };
      };
  });