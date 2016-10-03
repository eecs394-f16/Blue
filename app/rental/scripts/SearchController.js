angular
  .module('rental')
  .controller('SearchController', function($scope, supersonic) {

    $scope.navbarTitle = "Search";
    
    $scope.getInput = function() {
      
        supersonic.logger.debug($scope.searchInput);
        $scope.searchResults =
        [
         {"id":"57e85d570640af0011000003","Rate":50,"Pid":1,"Uid":2,"Name":"Mountain Bike","Description":"Great all-purpose mountain bike for use to ride on the countryside","Rating":5},
         {"id":"57ec44c6c95abd0011000001","Rate":5,"Pid":2,"Uid":3,"Name":"Paddle board","Description":"Wooden paddleboard rarely used","Rating":4},
         {"id":"57ec4532c95abd0013000001","Rate":1,"Pid":3,"Uid":1,"Name":"Long board","Description":"Long board with orange wheels. Two years old","Rating":3},
         {"id":"57ec48f2c95abd0011000002","Rate":10,"Pid":4,"Uid":3,"Name":"Mountain Bike","Description":"Lousy mountain bike noone wants","Rating":1}
         ];
        
    };

    $scope.getDetails = function(Pid) {

        supersonic.data.model('Product').findAll({query: JSON.stringify({"Pid": Pid})}).then(function(Products) {
            supersonic.logger.debug(Pid);
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
