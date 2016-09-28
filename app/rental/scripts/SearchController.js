angular
  .module('rental')
  .controller('SearchController', function($scope, supersonic) {
    $scope.navbarTitle = "Search";
    
    $scope.getDetails = function() {
    
        supersonic.data.model('Product').findAll({query: JSON.stringify({"Pid": 1})}).then(function(Products) {
            
            supersonic.data.model('Users').findAll({query: JSON.stringify({"Uid": Products[0].Uid})}).then(function(Users) {

            localStorage.setItem('user', Users[0].Username);
            });
            localStorage.setItem('productName', Products[0].Name);
            localStorage.setItem('productRate', Products[0].Rate);
            localStorage.setItem('productDescription', Products[0].Description);
            localStorage.setItem('productRating', Products[0].Rating);
            });
        };
  });
