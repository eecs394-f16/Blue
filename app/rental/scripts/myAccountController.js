angular
  .module('rental')
  .controller('myAccountController', function ($scope) {
      $scope.loadProfile = function () {
          $scope.account = { 'name': 'Brian Walker', 'location': 'Evanston, IL', 'email': 'brian@nu.com', 'number': '(123) 567-789', 'description': 'I have many things to rent out' };
      };

      $scope.myThings = [
          {
              'Name': 'Skateboard',
              'Img': 'http://www.bonkersenergy.com/wp-content/uploads/2015/07/skateboard_01.jpg',
              'Rate': 5,
              'Rating': 5
          }
      ];
  });