angular
  .module('rental')
  .controller('DetailController', function($scope, supersonic, $http) {
    
     $scope.update = function(listing) {
        
        supersonic.logger.debug(listing);
    };
    
    $http({
        method : "GET",
        url : "http://naybro-node.mybluemix.net/user",
        params : {
            uid : 4
        }}).then(function(response) {
        
        $scope.username = response.data[0].Username;
        });
    });