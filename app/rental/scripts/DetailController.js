angular
  .module('rental')
  .controller('DetailController', function($scope) {

    $scope.username= localStorage.getItem('user');
    $scope.productRate=localStorage.getItem('productRate');
    $scope.productRating=localStorage.getItem('productRating');
    $scope.productName=localStorage.getItem('productName');
    $scope.productDescription=localStorage.getItem('productDescription');
  });
